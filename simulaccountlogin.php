<?php
session_start();

require 'db.php';
require 'createid.php';

if (!empty($_SESSION['uniqId']) && !empty($_SESSION['username'])) {
    header("Location: index.php");
    exit();
}

function validInput($value)
{
    return trim(htmlspecialchars($value, ENT_QUOTES));
}

function getDomainFromUrl($url)
{
    $parsedUrl = parse_url($url);

    if (!isset($parsedUrl['scheme'])) {
        $url = 'http://' . $url;
        $parsedUrl = parse_url($url);
    }

    return $parsedUrl['host'] ?? null;
}

$errors = [];
$autorized = false;

$url_return = $_GET['url_return'] ?? '';
$getUniqId = $_GET['getUniqId'] ?? '';

if (!empty($url_return)) {
    $sql = "SELECT * FROM autorizedurl WHERE url = :url AND uniqId = :uniqId";
    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':url', $url_return);
    $stmt->bindValue(':uniqId', $getUniqId);
    $stmt->execute();
    $results = $stmt->fetchAll();

    if ($stmt->rowCount() > 0) {
        $autorized = $results[0]['statue'] ?? 'none';
    } else {
        $autorized = 'none';
    }

    $sql2 = "SELECT * FROM config WHERE url = :url AND uniqId = :uniqId";
    $stmt2 = $conn->prepare($sql2);
    $stmt2->bindValue(':url', $url_return);
    $stmt2->bindValue(':uniqId', $getUniqId);
    $stmt2->execute();
    $results2 = $stmt2->fetchAll();
} else {
    $autorized = "Fondateur";
}

if (isset($_POST['login'])) {
    $email = validInput($_POST['email']);
    $password = validInput($_POST['password']);

    if (empty($email)) {
        $errors[] = "Email is empty";
    }

    if (empty($password)) {
        $errors[] = "Password is empty";
    }

    if (count($errors) === 0) {
        $sql = "SELECT * FROM members WHERE email = :email";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':email', $email);
        $stmt->execute();
        $result = $stmt->fetchAll();

        if ($stmt->rowCount() === 0) {
            $errors[] = "This email doesn't exist";
            $_SESSION['errors'] = $errors;
        } else {
            foreach ($result as $value) {
                $hashPassword = $value['password'];
                if (password_verify($password, $hashPassword)) {
                    $response = [
                        'username' => $value['username'],
                        'lastname' => $value['lastname'],
                        'email' => $value['email'],
                        'password' => $password,
                        'phone' => $value['phone'],
                        'birthday' => $value['birthday'],
                        'uniqId' => $value['uniqId'],
                        'timezone' => $value['timezone'],
                        'postalcode' => $value['postalcode'],
                        'address' => $value['address'],
                        'city' => $value['city'],
                        'country' => $value['country'],
                        'token_login' => $value['token_login'],
                    ];

                    unset($_SESSION['errors']);
                    if (!empty($url_return)) {
                        $sql = "INSERT INTO historics (uniqId, memberId, url, datetime) VALUES (:uniqId, :memberId, :url, :datetime)";
                        $stmt = $conn->prepare($sql);
                        $stmt->bindValue(":uniqId", createId());
                        $stmt->bindValue(":memberId", $value['uniqId']);
                        $stmt->bindValue(":url", $url_return);
                        $stmt->bindValue(":datetime", date("Y-m-d H:i:s"));
                        $stmt->execute();

                        $formatUrl = $url_return . "?methode=simulaccountV1";

                        foreach ($results2[0] as $key => $configValue) {
                            if (!is_numeric($key) && $configValue === 'true' && isset($response[$key])) {
                                $formatUrl .= "&" . urlencode($key) . "=" . urlencode($response[$key]);
                            }
                        }

                        $formatUrl .= "&token_login=" . $value['token_login'];
                        header("Location: " . $formatUrl);
                        echo $formatUrl;
                        exit();
                    } else {
                        $_SESSION['username'] = $response['username'];
                        $_SESSION['uniqId'] = $response['uniqId'];
                        header("Location: index.php");
                        exit();
                    }
                } else {
                    $errors[] = "Password is incorrect";
                    $_SESSION['errors'] = $errors;
                }
            }
        }
    } else {
        $_SESSION['errors'] = $errors;
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Connexion | Dashboard</title>
    <link rel="stylesheet" href="assets/css/connection.css">
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        .two-per-line {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .two-per-line li {
            flex: 1 1 calc(50% - 10px);
            box-sizing: border-box;
            text-align: left;
            background-color: var(--primary-hover);
            padding: 10px;
            border: 1px solid var(--primary);
            border-radius: 5px;
        }

        .refuse li {
            background-color: var(--danger-hover);
            border: 1px solid var(--danger);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="auth-box">
            <div class="auth-header">
                <h1>Connexion</h1>
                <?php 
                    $class = match ($autorized) {
                        'pending' => 'pending',
                        'banned' => 'banned',
                        'Fondateur', 'validated' => 'valid',
                        default => 'banned',
                    };

                    $text = match ($autorized) {
                        'pending' => 'Pending',
                        'banned' => 'Banned',
                        'Fondateur' => 'Fondateur',
                        'validated' => 'Validated',
                        default => 'Unknown',
                    };
                ?>
                <p>Statut du site utilisant Simul Account: <span class="<?= $class; ?>"><?= $text; ?></span></p>
                <?php if ($text != "Fondateur" && $text != "Unknown" && $text != "banned"): ?>
                    <p id="info">Afficher les <b>informations</b> que va récupérer le site: <?php echo getDomainFromUrl($url_return); ?></p>
                <?php endif; ?>
            </div>

            <?php if ($autorized != "banned" && $autorized != "none"): ?>
                <form action="" method="post" class="auth-form">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" name="email" id="email" placeholder="Votre email" required>
                    </div>

                    <div class="form-group">
                        <label for="password">Mot de passe</label>
                        <input type="password" name="password" id="password" placeholder="Votre mot de passe" required>
                    </div>

                    <button type="submit" name="login" class="btn-primary">Se connecter</button>

                    <?php if (isset($_SESSION['errors']) && !empty($_SESSION['errors'])): ?>
                        <div class="error-messages">
                            <?php foreach ($_SESSION['errors'] as $error): ?>
                                <p><?= htmlspecialchars($error); ?></p>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>

                    <p class="auth-link">
                        Pas encore de compte ? <a href="register.php">S'inscrire</a>
                    </p>
                </form>
            <?php else: ?>
                <p style="text-align: center; line-height: 1.6;">
                    Le site que vous tentez d'utiliser avec Simul Account n'est pas autorisé à accéder à ce service.
                    Cela peut être dû à un problème de configuration ou à un manque d'autorisation.
                    Veuillez contacter l'administrateur du site.
                </p>
                <br>
                <p>Retourner vers le site d'origine: <a href="<?= htmlspecialchars($url_return); ?>"><?= htmlspecialchars($url_return); ?></a></p>
            <?php endif; ?>
        </div>
    </div>

    <div id="modal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h3>Ce site <?php echo htmlspecialchars(getDomainFromUrl($url_return)); ?> accède :</h3>
            <ul class="two-per-line">
                <?php
                foreach ($results2[0] as $key => $value) {
                    if (!is_numeric($key) && $value === 'true') {
                        echo "<li>" . htmlspecialchars($key) . "</li>";
                    }
                }
                ?>
            </ul>
            <?php 
                $hasFalse = false;
                foreach ($results2[0] as $key => $value) {
                    if (!is_numeric($key) && $value === 'false') {
                        $hasFalse = true;
                        break;
                    }
                }
            ?>
            <?php if ($hasFalse): ?>
                <h3>Ce site <?php echo htmlspecialchars(getDomainFromUrl($url_return)); ?> n'accède pas à :</h3>
                <ul class="two-per-line refuse">
                    <?php
                    foreach ($results2[0] as $key => $value) {
                        if (!is_numeric($key) && $value === 'false') {
                            echo "<li>" . htmlspecialchars($key) . "</li>";
                        }
                    }
                    ?>
                </ul>
            <?php endif; ?>
            <div class="modal-buttons">
                <button id="cancelClear" onclick="closeModal()">Close</button>
            </div>
        </div>
    </div>
    
    <footer class="footer">
        <p>&copy; 2024 Dashboard. Tous droits réservés.</p>
    </footer>

    <script src="assets/js/login.js"></script>
</body>
</html>