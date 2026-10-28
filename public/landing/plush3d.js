"use strict";(()=>{var ss=[{id:"commune",name:"Commune",color:"#b8bfcc",clicks:3,upgrade:.12},{id:"rare",name:"Rare",color:"#ff7ac2",clicks:6,upgrade:.09},{id:"epique",name:"\xC9pique",color:"#a06bff",clicks:10,upgrade:.06},{id:"legendaire",name:"L\xE9gendaire",color:"#ffc14d",clicks:16,upgrade:.035},{id:"mythique",name:"Mythique",color:"#ff5f9e",clicks:24,upgrade:0}],Ne=(i,e,t,n,s,r,a)=>({id:i,name:e,root:t,tip:n,body:s,glow:r,...a?{hueShift:a}:{}}),uu=[{id:"brique-tendresse",name:"Brique Tendresse",shape:"dragon",rarity:0,tagline:"C\xE2line et robuste, elle r\xE9chauffe les c\u0153urs.",preset:Ne("brique-tendresse","Brique Tendresse","#5c2418","#ffab8f","#c46445","#ff8a5c")},{id:"brume-douce",name:"Brume Douce",shape:"lapin",rarity:0,tagline:"Une brume toute douce qui sent le coton.",preset:Ne("brume-douce","Brume Douce","#4a4552","#d9d4e0","#8f8899","#c9c2d4")},{id:"fraise-tagada",name:"Fraise Tagada",shape:"fantome",rarity:1,tagline:"Sucr\xE9e, rose et un peu farceuse.",preset:Ne("fraise-tagada","Fraise Tagada","#8f1039","#ffa8c9","#e83a70","#ff4f8f")},{id:"mure-sucree",name:"M\xFBre Sucr\xE9e",shape:"dragon",rarity:1,tagline:"Petite boule violine aux ailes de confiture.",preset:Ne("mure-sucree","M\xFBre Sucr\xE9e","#3a1050","#cf9fff","#7d3ab8","#a86bff")},{id:"aurore-boreale",name:"Aurore Bor\xE9ale",shape:"lapin",rarity:2,tagline:"Ses oreilles captent les lumi\xE8res du Nord.",preset:Ne("aurore-boreale","Aurore Bor\xE9ale","#0d3a33","#7affe0","#17a08a","#3dffc4")},{id:"orchidee-neon",name:"Orchid\xE9e N\xE9on",shape:"fantome",rarity:2,tagline:"Elle brille dans la p\xE9nombre des serres.",preset:Ne("orchidee-neon","Orchid\xE9e N\xE9on","#4a0d4a","#ff9ff3","#c93ac9","#ff5ce1")},{id:"or-rose-royal",name:"Or Rose Royal",shape:"dragon",rarity:3,tagline:"Sa couronne de braise scintille d'or rose.",preset:Ne("or-rose-royal","Or Rose Royal","#8f5c1a","#ffe9b8","#e8b84d","#ffd76b")},{id:"emeraude-imperiale",name:"\xC9meraude Imp\xE9riale",shape:"lapin",rarity:3,tagline:"Un joyau tout rond venu des jungles d'antan.",preset:Ne("emeraude-imperiale","\xC9meraude Imp\xE9riale","#0d3d24","#7dffc9","#17a860","#3dff9c")},{id:"soleil-couchant",name:"Soleil Couchant",shape:"fantome",rarity:3,tagline:"Il flotte \xE0 l'heure o\xF9 le ciel devient orange.",preset:Ne("soleil-couchant","Soleil Couchant","#7a1f0d","#ffc98f","#f07a3a","#ff9c4d")},{id:"prisme-sacre",name:"Prisme Sacr\xE9",shape:"dragon",rarity:4,tagline:"Sa fourrure arc-en-ciel change au moindre souffle.",preset:Ne("prisme-sacre","Prisme Sacr\xE9","#33201a","#fff4e0","#a85c2a","#ffb84d",1)}],du=[{id:"cafe-creme",name:"Caf\xE9 Cr\xE8me",shape:"mochi",rarity:0,tagline:"Un chat tout doux aux couleurs du caf\xE9 et de la cr\xE8me.",preset:Ne("cafe-creme","Caf\xE9 Cr\xE8me","#4a3520","#e8cfa8","#9c7a4e","#d9b06c")},{id:"pistache-reveil",name:"Pistache R\xE9veil",shape:"mochi",rarity:1,tagline:"Un chat vert tendre, frais comme un matin de printemps.",preset:Ne("pistache-reveil","Pistache R\xE9veil","#2a5c30","#b8f0a8","#5fae5a","#8fe07a")},{id:"sorbet-mangue",name:"Sorbet Mangue",shape:"mochi",rarity:2,tagline:"Un chat aux couleurs lumineuses d'un sorbet \xE0 la mangue.",preset:Ne("sorbet-mangue","Sorbet Mangue","#7a3a0d","#ffe08f","#f0a83a","#ffc94d")},{id:"galaxie-arc-en-ciel",name:"Galaxie Arc-en-ciel",shape:"mochi",rarity:4,tagline:"Un chat mythique dont la fourrure r\xE9v\xE8le toutes les couleurs.",preset:Ne("galaxie-arc-en-ciel","Galaxie Arc-en-ciel","#1a0d33","#ffffff","#4d2a8f","#b26bff",1)},{id:"renard-cannelle",name:"Renard Cannelle",shape:"renard",rarity:0,tagline:"Sa queue touffue sent bon la cannelle et les matins d'automne.",preset:Ne("renard-cannelle","Renard Cannelle","#8a3b12","#ffd9a8","#e07a3a","#ffb066")},{id:"renard-neige",name:"Renard Neige",shape:"renard",rarity:0,tagline:"Il se fond dans les cong\xE8res et ne laisse que deux yeux malicieux.",preset:Ne("renard-neige","Renard Neige","#7a8794","#ffffff","#e8eef5","#cfe6ff")},{id:"renard-miel",name:"Renard Miel",shape:"renard",rarity:1,tagline:"Ses oreilles dor\xE9es bourdonnent doucement quand il est content.",preset:Ne("renard-miel","Renard Miel","#8a5a12","#ffe6a8","#e0a83a","#ffd166")},{id:"renard-braise",name:"Renard Braise",shape:"renard",rarity:2,tagline:"Il danse autour du feu et fait cr\xE9piter sa fourrure \xE9carlate.",preset:Ne("renard-braise","Renard Braise","#6a160d","#ffb08f","#e0432a","#ff7a3d")},{id:"renard-aurore",name:"Renard Aurore",shape:"renard",rarity:3,tagline:"Ses poils captent les premi\xE8res lueurs roses du ciel polaire.",preset:Ne("renard-aurore","Renard Aurore","#5a1a3a","#ffd1e8","#d94a8a","#ff8fc4")},{id:"ours-chocolat",name:"Ours Chocolat",shape:"ours",rarity:0,tagline:"Un gros c\xE2lin fondant qui laisse des miettes de bonheur.",preset:Ne("ours-chocolat","Ours Chocolat","#4a2a18","#d9b08f","#8a5a3a","#c98a5c")},{id:"ours-caramel",name:"Ours Caramel",shape:"ours",rarity:0,tagline:"Ses pattes collent un peu, mais son c\u0153ur est tout mou.",preset:Ne("ours-caramel","Ours Caramel","#6a4a1a","#ffd9a8","#c98a4b","#ffb56b")},{id:"ours-myrtille",name:"Ours Myrtille",shape:"ours",rarity:1,tagline:"Il revient toujours de la for\xEAt avec le museau tout bleu.",preset:Ne("ours-myrtille","Ours Myrtille","#2a1a4a","#b8a8ff","#6a4ac9","#9c7aff")},{id:"ours-foret",name:"Ours For\xEAt",shape:"ours",rarity:2,tagline:"De la mousse plein les oreilles et des champignons dans la fourrure.",preset:Ne("ours-foret","Ours For\xEAt","#1a3a24","#a8e0b8","#3a8a5a","#5cc98a")},{id:"ours-polaire",name:"Ours Polaire",shape:"ours",rarity:3,tagline:"Il dort dix mois par an et r\xEAve de glaces \xE0 la vanille.",preset:Ne("ours-polaire","Ours Polaire","#4a6a7a","#ffffff","#cfe6f0","#a8e0ff")},{id:"grenouille-menthe",name:"Grenouille Menthe",shape:"grenouille",rarity:0,tagline:"Un petit saut frais qui r\xE9veille toute la mare.",preset:Ne("grenouille-menthe","Grenouille Menthe","#1a4a2a","#b8ffd1","#4ac97a","#7affa8")},{id:"grenouille-citron",name:"Grenouille Citron",shape:"grenouille",rarity:0,tagline:"Sa peau p\xE9tille comme une limonade un jour de f\xEAte.",preset:Ne("grenouille-citron","Grenouille Citron","#4a5a1a","#f0ffa8","#a8c93a","#d1ff5c")},{id:"grenouille-lagon",name:"Grenouille Lagon",shape:"grenouille",rarity:1,tagline:"Elle conna\xEEt toutes les flaques secr\xE8tes du r\xE9cif.",preset:Ne("grenouille-lagon","Grenouille Lagon","#0d3a4a","#a8f0ff","#2aa8c9","#5cd1ff")},{id:"grenouille-rose",name:"Grenouille Rose",shape:"grenouille",rarity:1,tagline:"Elle rougit quand on la regarde, puis saute dans les n\xE9nuphars.",preset:Ne("grenouille-rose","Grenouille Rose","#4a1a3a","#ffb8e0","#e05aa8","#ff8fd1")},{id:"grenouille-emeraude",name:"Grenouille \xC9meraude",shape:"grenouille",rarity:2,tagline:"Ses yeux brillent comme deux pierres pr\xE9cieuses au fond de l'eau.",preset:Ne("grenouille-emeraude","Grenouille \xC9meraude","#0d3d24","#7dffc9","#17a860","#3dff9c")},{id:"licorne-nuage",name:"Licorne Nuage",shape:"licorne",rarity:0,tagline:"Elle trotte sur les nuages et laisse une tra\xEEn\xE9e de ouate.",preset:Ne("licorne-nuage","Licorne Nuage","#7a6a8a","#ffffff","#e8e0f0","#ffd9ef")},{id:"licorne-lavande",name:"Licorne Lavande",shape:"licorne",rarity:0,tagline:"Son parfum endort les chagrins et r\xE9veille les r\xEAves.",preset:Ne("licorne-lavande","Licorne Lavande","#4a3a6a","#e0d1ff","#9c7ad9","#c9a8ff")},{id:"licorne-pastel",name:"Licorne Pastel",shape:"licorne",rarity:1,tagline:"Sa crini\xE8re change de couleur au rythme de ses humeurs.",preset:Ne("licorne-pastel","Licorne Pastel","#6a4a5a","#ffe0f0","#e0a8c9","#ffc9e0")},{id:"licorne-doree",name:"Licorne Dor\xE9e",shape:"licorne",rarity:2,tagline:"Chaque pas qu'elle fait laisse une petite poussi\xE8re d'or.",preset:Ne("licorne-doree","Licorne Dor\xE9e","#7a5a1a","#fff0b8","#e0b84d","#ffd76b")},{id:"licorne-celeste",name:"Licorne C\xE9leste",shape:"licorne",rarity:3,tagline:"Sa corne indique le chemin des \xE9toiles filantes.",preset:Ne("licorne-celeste","Licorne C\xE9leste","#1a2a5a","#b8d1ff","#4a7ae0","#8fa8ff")},{id:"hibou-noisette",name:"Hibou Noisette",shape:"hibou",rarity:0,tagline:"Il hulule des berceuses en grignotant une noisette.",preset:Ne("hibou-noisette","Hibou Noisette","#4a3a24","#d9c0a8","#8a6a4a","#c9a87a")},{id:"hibou-perle",name:"Hibou Perle",shape:"hibou",rarity:1,tagline:"Ses plumes nacr\xE9es luisent doucement les nuits sans lune.",preset:Ne("hibou-perle","Hibou Perle","#5a5a6a","#ffffff","#b8b8c9","#e0e0f0")},{id:"hibou-crepuscule",name:"Hibou Cr\xE9puscule",shape:"hibou",rarity:1,tagline:"Il veille entre chien et loup, les yeux grands ouverts.",preset:Ne("hibou-crepuscule","Hibou Cr\xE9puscule","#2a1a4a","#ffb88f","#6a3a8a","#ff8f5c")},{id:"hibou-lunaire",name:"Hibou Lunaire",shape:"hibou",rarity:2,tagline:"Ses yeux refl\xE8tent la lune m\xEAme en plein jour.",preset:Ne("hibou-lunaire","Hibou Lunaire","#1a2a3a","#d1e0ff","#4a6a8a","#a8c9ff")},{id:"hibou-galaxie",name:"Hibou Galaxie",shape:"hibou",rarity:4,tagline:"Une nuit enti\xE8re est nich\xE9e dans le duvet de son ventre.",preset:Ne("hibou-galaxie","Hibou Galaxie","#0d0a2a","#ffffff","#3a2a8a","#b26bff",1)},{id:"pingouin-glacier",name:"Pingouin Glacier",shape:"pingouin",rarity:0,tagline:"Il glisse sur le ventre plus vite que son ombre.",preset:Ne("pingouin-glacier","Pingouin Glacier","#1a3a4a","#d1f0ff","#4a8aa8","#8fd1ff")},{id:"pingouin-mandarine",name:"Pingouin Mandarine",shape:"pingouin",rarity:1,tagline:"Son bec orange sent bon les agrumes et le froid piquant.",preset:Ne("pingouin-mandarine","Pingouin Mandarine","#1a1a1a","#ffd1a8","#e07a3a","#ffb066")},{id:"pingouin-eclipse",name:"Pingouin \xC9clipse",shape:"pingouin",rarity:2,tagline:"Il nage dans l'ombre et ne r\xE9appara\xEEt qu'au lever du soleil.",preset:Ne("pingouin-eclipse","Pingouin \xC9clipse","#0d0d1a","#b8a8ff","#3a2a5a","#8f7aff")},{id:"pingouin-boreal",name:"Pingouin Bor\xE9al",shape:"pingouin",rarity:3,tagline:"Ses plumes s'illuminent comme une aurore au-dessus des glaces.",preset:Ne("pingouin-boreal","Pingouin Bor\xE9al","#0d3a33","#7affe0","#17a08a","#3dffc4")},{id:"pingouin-prisme",name:"Pingouin Prisme",shape:"pingouin",rarity:4,tagline:"La lumi\xE8re se brise sur son ventre en mille couleurs dansantes.",preset:Ne("pingouin-prisme","Pingouin Prisme","#1a1a2a","#ffffff","#5a5a8a","#b26bff",1)}],Ol=[...uu,...du],Bl={mochi:{length:.65,density:1,wind:1,countMul:1,lenMul:1,widthMul:1.25},dragon:{length:.7,density:.95,wind:.8,countMul:.75,lenMul:.85,widthMul:1.2},lapin:{length:.6,density:1,wind:1.15,countMul:1.05,lenMul:1.2,widthMul:1.15},fantome:{length:.55,density:.5,wind:1.5,countMul:.35,lenMul:1.65,widthMul:1.25},renard:{length:.62,density:1,wind:1.05,countMul:.95,lenMul:1.05,widthMul:1.15},ours:{length:.7,density:1,wind:.9,countMul:1.1,lenMul:1,widthMul:1.3},grenouille:{length:.5,density:.85,wind:.8,countMul:.8,lenMul:.75,widthMul:1.05},licorne:{length:.68,density:.95,wind:1.2,countMul:.9,lenMul:1.25,widthMul:1.1},hibou:{length:.58,density:.95,wind:.9,countMul:.9,lenMul:.95,widthMul:1.2},pingouin:{length:.55,density:.9,wind:.8,countMul:.85,lenMul:.9,widthMul:1.1}},zl={mochi:1,dragon:1.06,lapin:1.14,fantome:1,renard:1.02,ours:1.08,grenouille:1.1,licorne:1.12,hibou:1.05,pingouin:1.1},Vl=[{id:"mochi",name:"Mochi Chat",shape:"mochi",tagline:"Le classique tout rond, doux comme un mochi frais.",preset:Ne("sakura","Sakura Mochi","#6d0e63","#ff8fe4","#d02bbd","#ff3fd8")},{id:"dragon",name:"Dragonnet",shape:"dragon",tagline:"Rondouillard cracheur de braises, cornes fi\xE8res et museau arrondi.",preset:Ne("dragonnet","Dragonnet","#7c2413","#ffa94d","#c4472e","#ff8a5c")},{id:"lapin",name:"Pompon Lapin",shape:"lapin",tagline:"Tout en hauteur avec de grandes oreilles et un c\u0153ur tout doux.",preset:Ne("pompon","Pompon Lapin","#b59ada","#ffe9f4","#e9def4","#d9b3ff")},{id:"fantome",name:"Piou Fant\xF4me",shape:"fantome",tagline:"Il flotte, il brille, et sa jupe ondule toute seule la nuit.",preset:Ne("piou","Piou Fant\xF4me","#6f93c8","#e6f4ff","#aecdf2","#9cc2ff")}];var cc=0,Ao=1,hc=2;var Ps=1,uc=2,Hi=3,Jn=0,zt=1,Kt=2,yn=0,ki=1,Gi=2,Ro=3,Co=4,dc=5;var hi=100,fc=101,pc=102,mc=103,gc=104,_c=200,xc=201,yc=202,vc=203,Po=204,Io=205,Mc=206,Sc=207,bc=208,Ec=209,Tc=210,wc=211,Ac=212,Rc=213,Cc=214,mr=0,gr=1,_r=2,Ii=3,xr=4,yr=5,vr=6,Mr=7,Lo=0,Pc=1,Ic=2,Yt=0,No=1,Do=2,Uo=3,Fo=4,Oo=5,Bo=6,zo=7;var Vo=300,$n=301,ui=302,Zr=303,Jr=304,Is=306,Sr=1e3,pn=1001,br=1002,wt=1003,Lc=1004;var Ls=1005;var Ct=1006,$r=1007;var Kn=1008;var Ht=1009,Ho=1010,ko=1011,Wi=1012,Kr=1013,ln=1014,cn=1015,hn=1016,Qr=1017,jr=1018,Xi=1020,Go=35902,Wo=35899,Xo=1021,qo=1022,Qt=1023,mn=1026,Qn=1027,Yo=1028,ea=1029,jn=1030,ta=1031;var na=1033,Ns=33776,Ds=33777,Us=33778,Fs=33779,ia=35840,sa=35841,ra=35842,aa=35843,oa=36196,la=37492,ca=37496,ha=37488,ua=37489,Os=37490,da=37491,fa=37808,pa=37809,ma=37810,ga=37811,_a=37812,xa=37813,ya=37814,va=37815,Ma=37816,Sa=37817,ba=37818,Ea=37819,Ta=37820,wa=37821,Aa=36492,Ra=36494,Ca=36495,Pa=36283,Ia=36284,Bs=36285,La=36286;var us=2300,Er=2301,fr=2302,yo=2303,vo=2400,Mo=2401,So=2402;var Nc=3200;var Na=0,Dc=1,Cn="",Rt="srgb",ds="srgb-linear",fs="linear",it="srgb";var pr=7680;var Uc=519,Fc=512,Oc=513,Bc=514,Da=515,zc=516,Vc=517,Ua=518,Hc=519,kc=35044,Zo=35048;var Jo="300 es",rn=2e3,Li=2001;function fu(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function pu(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function ps(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Gc(){let i=ps("canvas");return i.style.display="block",i}var Hl={},Ni=null;function $o(...i){let e="THREE."+i.shift();Ni?Ni("log",e,...i):console.log(e,...i)}function Wc(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Le(...i){i=Wc(i);let e="THREE."+i.shift();if(Ni)Ni("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function De(...i){i=Wc(i);let e="THREE."+i.shift();if(Ni)Ni("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function ri(...i){let e=i.join(" ");e in Hl||(Hl[e]=!0,Le(...i))}function Xc(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var qc={[mr]:gr,[_r]:vr,[xr]:Mr,[Ii]:yr,[gr]:mr,[vr]:_r,[Mr]:xr,[yr]:Ii},gn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},It=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],kl=1234567,cs=Math.PI/180,Di=180/Math.PI;function qi(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(It[i&255]+It[i>>8&255]+It[i>>16&255]+It[i>>24&255]+"-"+It[e&255]+It[e>>8&255]+"-"+It[e>>16&15|64]+It[e>>24&255]+"-"+It[t&63|128]+It[t>>8&255]+"-"+It[t>>16&255]+It[t>>24&255]+It[n&255]+It[n>>8&255]+It[n>>16&255]+It[n>>24&255]).toLowerCase()}function Ke(i,e,t){return Math.max(e,Math.min(t,i))}function Ko(i,e){return(i%e+e)%e}function mu(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function gu(i,e,t){return i!==e?(t-i)/(e-i):0}function hs(i,e,t){return(1-t)*i+t*e}function _u(i,e,t,n){return hs(i,e,1-Math.exp(-t*n))}function xu(i,e=1){return e-Math.abs(Ko(i,e*2)-e)}function yu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function vu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Mu(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Su(i,e){return i+Math.random()*(e-i)}function bu(i){return i*(.5-Math.random())}function Eu(i){i!==void 0&&(kl=i);let e=kl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Tu(i){return i*cs}function wu(i){return i*Di}function Au(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function Ru(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Cu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Pu(i,e,t,n,s){let r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+n)/2),u=a((e+n)/2),d=r((e-n)/2),h=a((e-n)/2),m=r((n-e)/2),x=a((n-e)/2);switch(s){case"XYX":i.set(o*u,c*d,c*h,o*l);break;case"YZY":i.set(c*h,o*u,c*d,o*l);break;case"ZXZ":i.set(c*d,c*h,o*u,o*l);break;case"XZX":i.set(o*u,c*x,c*m,o*l);break;case"YXY":i.set(c*m,o*u,c*x,o*l);break;case"ZYZ":i.set(c*x,c*m,o*u,o*l);break;default:Le("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ci(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Ft(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Zt={DEG2RAD:cs,RAD2DEG:Di,generateUUID:qi,clamp:Ke,euclideanModulo:Ko,mapLinear:mu,inverseLerp:gu,lerp:hs,damp:_u,pingpong:xu,smoothstep:yu,smootherstep:vu,randInt:Mu,randFloat:Su,randFloatSpread:bu,seededRandom:Eu,degToRad:Tu,radToDeg:wu,isPowerOfTwo:Au,ceilPowerOfTwo:Ru,floorPowerOfTwo:Cu,setQuaternionFromProperEuler:Pu,normalize:Ft,denormalize:Ci},ke=class i{static{i.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},_n=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],u=n[s+2],d=n[s+3],h=r[a+0],m=r[a+1],x=r[a+2],S=r[a+3];if(d!==S||c!==h||l!==m||u!==x){let p=c*h+l*m+u*x+d*S;p<0&&(h=-h,m=-m,x=-x,S=-S,p=-p);let f=1-o;if(p<.9995){let M=Math.acos(p),A=Math.sin(M);f=Math.sin(f*M)/A,o=Math.sin(o*M)/A,c=c*f+h*o,l=l*f+m*o,u=u*f+x*o,d=d*f+S*o}else{c=c*f+h*o,l=l*f+m*o,u=u*f+x*o,d=d*f+S*o;let M=1/Math.sqrt(c*c+l*l+u*u+d*d);c*=M,l*=M,u*=M,d*=M}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],c=n[s+1],l=n[s+2],u=n[s+3],d=r[a],h=r[a+1],m=r[a+2],x=r[a+3];return e[t]=o*x+u*d+c*m-l*h,e[t+1]=c*x+u*h+l*d-o*m,e[t+2]=l*x+u*m+o*h-c*d,e[t+3]=u*x-o*d-c*h-l*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),u=o(s/2),d=o(r/2),h=c(n/2),m=c(s/2),x=c(r/2);switch(a){case"XYZ":this._x=h*u*d+l*m*x,this._y=l*m*d-h*u*x,this._z=l*u*x+h*m*d,this._w=l*u*d-h*m*x;break;case"YXZ":this._x=h*u*d+l*m*x,this._y=l*m*d-h*u*x,this._z=l*u*x-h*m*d,this._w=l*u*d+h*m*x;break;case"ZXY":this._x=h*u*d-l*m*x,this._y=l*m*d+h*u*x,this._z=l*u*x+h*m*d,this._w=l*u*d-h*m*x;break;case"ZYX":this._x=h*u*d-l*m*x,this._y=l*m*d+h*u*x,this._z=l*u*x-h*m*d,this._w=l*u*d+h*m*x;break;case"YZX":this._x=h*u*d+l*m*x,this._y=l*m*d+h*u*x,this._z=l*u*x-h*m*d,this._w=l*u*d-h*m*x;break;case"XZY":this._x=h*u*d-l*m*x,this._y=l*m*d-h*u*x,this._z=l*u*x+h*m*d,this._w=l*u*d+h*m*x;break;default:Le("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],u=t[6],d=t[10],h=n+o+d;if(h>0){let m=.5/Math.sqrt(h+1);this._w=.25/m,this._x=(u-c)*m,this._y=(r-l)*m,this._z=(a-s)*m}else if(n>o&&n>d){let m=2*Math.sqrt(1+n-o-d);this._w=(u-c)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+l)/m}else if(o>d){let m=2*Math.sqrt(1+o-n-d);this._w=(r-l)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(c+u)/m}else{let m=2*Math.sqrt(1+d-n-o);this._w=(a-s)/m,this._x=(r+l)/m,this._y=(c+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ke(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,u=t._w;return this._x=n*u+a*o+s*l-r*c,this._y=s*u+a*c+r*o-n*l,this._z=r*u+a*l+n*c-s*o,this._w=a*u-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){let l=Math.acos(o),u=Math.sin(l);c=Math.sin(c*l)/u,t=Math.sin(t*l)/u,this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},P=class i{static{i.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Gl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Gl.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),u=2*(o*t-r*s),d=2*(r*n-a*t);return this.x=t+c*l+a*d-o*u,this.y=n+c*u+o*l-r*d,this.z=s+c*d+r*u-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ka.copy(this).projectOnVector(e),this.sub(Ka)}reflect(e){return this.sub(Ka.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Ka=new P,Gl=new _n,Fe=class i{static{i.prototype.isMatrix3=!0}constructor(e,t,n,s,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){let u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=c,u[6]=n,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],u=n[4],d=n[7],h=n[2],m=n[5],x=n[8],S=s[0],p=s[3],f=s[6],M=s[1],A=s[4],v=s[7],b=s[2],T=s[5],R=s[8];return r[0]=a*S+o*M+c*b,r[3]=a*p+o*A+c*T,r[6]=a*f+o*v+c*R,r[1]=l*S+u*M+d*b,r[4]=l*p+u*A+d*T,r[7]=l*f+u*v+d*R,r[2]=h*S+m*M+x*b,r[5]=h*p+m*A+x*T,r[8]=h*f+m*v+x*R,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8];return t*a*u-t*o*l-n*r*u+n*o*c+s*r*l-s*a*c}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],d=u*a-o*l,h=o*c-u*r,m=l*r-a*c,x=t*d+n*h+s*m;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);let S=1/x;return e[0]=d*S,e[1]=(s*l-u*n)*S,e[2]=(o*n-s*a)*S,e[3]=h*S,e[4]=(u*t-s*c)*S,e[5]=(s*r-o*t)*S,e[6]=m*S,e[7]=(n*c-l*t)*S,e[8]=(a*t-n*r)*S,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return ri("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Qa.makeScale(e,t)),this}rotate(e){return ri("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Qa.makeRotation(-e)),this}translate(e,t){return ri("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Qa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Qa=new Fe,Wl=new Fe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Xl=new Fe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Iu(){let i={enabled:!0,workingColorSpace:ds,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===it&&(s.r=An(s.r),s.g=An(s.g),s.b=An(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===it&&(s.r=Pi(s.r),s.g=Pi(s.g),s.b=Pi(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Cn?fs:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return ri("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return ri("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ds]:{primaries:e,whitePoint:n,transfer:fs,toXYZ:Wl,fromXYZ:Xl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Rt},outputColorSpaceConfig:{drawingBufferColorSpace:Rt}},[Rt]:{primaries:e,whitePoint:n,transfer:it,toXYZ:Wl,fromXYZ:Xl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Rt}}}),i}var $e=Iu();function An(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Pi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var gi,Tr=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{gi===void 0&&(gi=ps("canvas")),gi.width=e.width,gi.height=e.height;let s=gi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=gi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=ps("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=An(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(An(t[n]/255)*255):t[n]=An(t[n]);return{data:t,width:e.width,height:e.height}}else return Le("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Lu=0,Ui=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Lu++}),this.uuid=qi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ja(s[a].image)):r.push(ja(s[a]))}else r=ja(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function ja(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Tr.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Le("Texture: Unable to serialize Texture."),{})}var Nu=0,eo=new P,Ot=class i extends gn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=pn,s=pn,r=Ct,a=Kn,o=Qt,c=Ht,l=i.DEFAULT_ANISOTROPY,u=Cn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Nu++}),this.uuid=qi(),this.name="",this.source=new Ui(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ke(0,0),this.repeat=new ke(1,1),this.center=new ke(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Fe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(eo).x}get height(){return this.source.getSize(eo).y}get depth(){return this.source.getSize(eo).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Le(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Le(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Vo)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Sr:e.x=e.x-Math.floor(e.x);break;case pn:e.x=e.x<0?0:1;break;case br:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Sr:e.y=e.y-Math.floor(e.y);break;case pn:e.y=e.y<0?0:1;break;case br:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Ot.DEFAULT_IMAGE=null;Ot.DEFAULT_MAPPING=Vo;Ot.DEFAULT_ANISOTROPY=1;var pt=class i{static{i.prototype.isVector4=!0}constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,c=e.elements,l=c[0],u=c[4],d=c[8],h=c[1],m=c[5],x=c[9],S=c[2],p=c[6],f=c[10];if(Math.abs(u-h)<.01&&Math.abs(d-S)<.01&&Math.abs(x-p)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+S)<.1&&Math.abs(x+p)<.1&&Math.abs(l+m+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let A=(l+1)/2,v=(m+1)/2,b=(f+1)/2,T=(u+h)/4,R=(d+S)/4,_=(x+p)/4;return A>v&&A>b?A<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(A),s=T/n,r=R/n):v>b?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=T/s,r=_/s):b<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),n=R/r,s=_/r),this.set(n,s,r,t),this}let M=Math.sqrt((p-x)*(p-x)+(d-S)*(d-S)+(h-u)*(h-u));return Math.abs(M)<.001&&(M=1),this.x=(p-x)/M,this.y=(d-S)/M,this.z=(h-u)/M,this.w=Math.acos((l+m+f-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this.w=Ke(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this.w=Ke(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},wr=class extends gn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ct,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new pt(0,0,e,t),this.scissorTest=!1,this.viewport=new pt(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new Ot(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Ct,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Ui(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Vt=class extends wr{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},ms=class extends Ot{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=wt,this.minFilter=wt,this.wrapR=pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Ar=class extends Ot{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=wt,this.minFilter=wt,this.wrapR=pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var mt=class i{static{i.prototype.isMatrix4=!0}constructor(e,t,n,s,r,a,o,c,l,u,d,h,m,x,S,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,u,d,h,m,x,S,p)}set(e,t,n,s,r,a,o,c,l,u,d,h,m,x,S,p){let f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=c,f[2]=l,f[6]=u,f[10]=d,f[14]=h,f[3]=m,f[7]=x,f[11]=S,f[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/_i.setFromMatrixColumn(e,0).length(),r=1/_i.setFromMatrixColumn(e,1).length(),a=1/_i.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let h=a*u,m=a*d,x=o*u,S=o*d;t[0]=c*u,t[4]=-c*d,t[8]=l,t[1]=m+x*l,t[5]=h-S*l,t[9]=-o*c,t[2]=S-h*l,t[6]=x+m*l,t[10]=a*c}else if(e.order==="YXZ"){let h=c*u,m=c*d,x=l*u,S=l*d;t[0]=h+S*o,t[4]=x*o-m,t[8]=a*l,t[1]=a*d,t[5]=a*u,t[9]=-o,t[2]=m*o-x,t[6]=S+h*o,t[10]=a*c}else if(e.order==="ZXY"){let h=c*u,m=c*d,x=l*u,S=l*d;t[0]=h-S*o,t[4]=-a*d,t[8]=x+m*o,t[1]=m+x*o,t[5]=a*u,t[9]=S-h*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){let h=a*u,m=a*d,x=o*u,S=o*d;t[0]=c*u,t[4]=x*l-m,t[8]=h*l+S,t[1]=c*d,t[5]=S*l+h,t[9]=m*l-x,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){let h=a*c,m=a*l,x=o*c,S=o*l;t[0]=c*u,t[4]=S-h*d,t[8]=x*d+m,t[1]=d,t[5]=a*u,t[9]=-o*u,t[2]=-l*u,t[6]=m*d+x,t[10]=h-S*d}else if(e.order==="XZY"){let h=a*c,m=a*l,x=o*c,S=o*l;t[0]=c*u,t[4]=-d,t[8]=l*u,t[1]=h*d+S,t[5]=a*u,t[9]=m*d-x,t[2]=x*d-m,t[6]=o*u,t[10]=S*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Du,e,Uu)}lookAt(e,t,n){let s=this.elements;return kt.subVectors(e,t),kt.lengthSq()===0&&(kt.z=1),kt.normalize(),Fn.crossVectors(n,kt),Fn.lengthSq()===0&&(Math.abs(n.z)===1?kt.x+=1e-4:kt.z+=1e-4,kt.normalize(),Fn.crossVectors(n,kt)),Fn.normalize(),Zs.crossVectors(kt,Fn),s[0]=Fn.x,s[4]=Zs.x,s[8]=kt.x,s[1]=Fn.y,s[5]=Zs.y,s[9]=kt.y,s[2]=Fn.z,s[6]=Zs.z,s[10]=kt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],u=n[1],d=n[5],h=n[9],m=n[13],x=n[2],S=n[6],p=n[10],f=n[14],M=n[3],A=n[7],v=n[11],b=n[15],T=s[0],R=s[4],_=s[8],E=s[12],C=s[1],U=s[5],F=s[9],B=s[13],I=s[2],k=s[6],G=s[10],q=s[14],ne=s[3],Y=s[7],j=s[11],ee=s[15];return r[0]=a*T+o*C+c*I+l*ne,r[4]=a*R+o*U+c*k+l*Y,r[8]=a*_+o*F+c*G+l*j,r[12]=a*E+o*B+c*q+l*ee,r[1]=u*T+d*C+h*I+m*ne,r[5]=u*R+d*U+h*k+m*Y,r[9]=u*_+d*F+h*G+m*j,r[13]=u*E+d*B+h*q+m*ee,r[2]=x*T+S*C+p*I+f*ne,r[6]=x*R+S*U+p*k+f*Y,r[10]=x*_+S*F+p*G+f*j,r[14]=x*E+S*B+p*q+f*ee,r[3]=M*T+A*C+v*I+b*ne,r[7]=M*R+A*U+v*k+b*Y,r[11]=M*_+A*F+v*G+b*j,r[15]=M*E+A*B+v*q+b*ee,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],u=e[2],d=e[6],h=e[10],m=e[14],x=e[3],S=e[7],p=e[11],f=e[15],M=c*m-l*h,A=o*m-l*d,v=o*h-c*d,b=a*m-l*u,T=a*h-c*u,R=a*d-o*u;return t*(S*M-p*A+f*v)-n*(x*M-p*b+f*T)+s*(x*A-S*b+f*R)-r*(x*v-S*T+p*R)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],c=e[2],l=e[6],u=e[10];return t*(a*u-o*l)-n*(r*u-o*c)+s*(r*l-a*c)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],d=e[9],h=e[10],m=e[11],x=e[12],S=e[13],p=e[14],f=e[15],M=t*o-n*a,A=t*c-s*a,v=t*l-r*a,b=n*c-s*o,T=n*l-r*o,R=s*l-r*c,_=u*S-d*x,E=u*p-h*x,C=u*f-m*x,U=d*p-h*S,F=d*f-m*S,B=h*f-m*p,I=M*B-A*F+v*U+b*C-T*E+R*_;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/I;return e[0]=(o*B-c*F+l*U)*k,e[1]=(s*F-n*B-r*U)*k,e[2]=(S*R-p*T+f*b)*k,e[3]=(h*T-d*R-m*b)*k,e[4]=(c*C-a*B-l*E)*k,e[5]=(t*B-s*C+r*E)*k,e[6]=(p*v-x*R-f*A)*k,e[7]=(u*R-h*v+m*A)*k,e[8]=(a*F-o*C+l*_)*k,e[9]=(n*C-t*F-r*_)*k,e[10]=(x*T-S*v+f*M)*k,e[11]=(d*v-u*T-m*M)*k,e[12]=(o*E-a*U-c*_)*k,e[13]=(t*U-n*E+s*_)*k,e[14]=(S*A-x*b-p*M)*k,e[15]=(u*b-d*A+h*M)*k,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,u=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,u*o+n,u*c-s*a,0,l*c-s*o,u*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,u=a+a,d=o+o,h=r*l,m=r*u,x=r*d,S=a*u,p=a*d,f=o*d,M=c*l,A=c*u,v=c*d,b=n.x,T=n.y,R=n.z;return s[0]=(1-(S+f))*b,s[1]=(m+v)*b,s[2]=(x-A)*b,s[3]=0,s[4]=(m-v)*T,s[5]=(1-(h+f))*T,s[6]=(p+M)*T,s[7]=0,s[8]=(x+A)*R,s[9]=(p-M)*R,s[10]=(1-(h+S))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=_i.set(s[0],s[1],s[2]).length(),o=_i.set(s[4],s[5],s[6]).length(),c=_i.set(s[8],s[9],s[10]).length();r<0&&(a=-a),en.copy(this);let l=1/a,u=1/o,d=1/c;return en.elements[0]*=l,en.elements[1]*=l,en.elements[2]*=l,en.elements[4]*=u,en.elements[5]*=u,en.elements[6]*=u,en.elements[8]*=d,en.elements[9]*=d,en.elements[10]*=d,t.setFromRotationMatrix(en),n.x=a,n.y=o,n.z=c,this}makePerspective(e,t,n,s,r,a,o=rn,c=!1){let l=this.elements,u=2*r/(t-e),d=2*r/(n-s),h=(t+e)/(t-e),m=(n+s)/(n-s),x,S;if(c)x=r/(a-r),S=a*r/(a-r);else if(o===rn)x=-(a+r)/(a-r),S=-2*a*r/(a-r);else if(o===Li)x=-a/(a-r),S=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=d,l[9]=m,l[13]=0,l[2]=0,l[6]=0,l[10]=x,l[14]=S,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=rn,c=!1){let l=this.elements,u=2/(t-e),d=2/(n-s),h=-(t+e)/(t-e),m=-(n+s)/(n-s),x,S;if(c)x=1/(a-r),S=a/(a-r);else if(o===rn)x=-2/(a-r),S=-(a+r)/(a-r);else if(o===Li)x=-1/(a-r),S=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=0,l[12]=h,l[1]=0,l[5]=d,l[9]=0,l[13]=m,l[2]=0,l[6]=0,l[10]=x,l[14]=S,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},_i=new P,en=new mt,Du=new P(0,0,0),Uu=new P(1,1,1),Fn=new P,Zs=new P,kt=new P,ql=new mt,Yl=new _n,Rn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],u=s[9],d=s[2],h=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(Ke(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ke(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ke(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ke(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,m),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Ke(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Ke(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,m),this._y=0);break;default:Le("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ql.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ql,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Yl.setFromEuler(this),this.setFromQuaternion(Yl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Rn.DEFAULT_ORDER="XYZ";var gs=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Fu=0,Zl=new P,xi=new _n,Sn=new mt,Js=new P,rs=new P,Ou=new P,Bu=new _n,Jl=new P(1,0,0),$l=new P(0,1,0),Kl=new P(0,0,1),Ql={type:"added"},zu={type:"removed"},yi={type:"childadded",child:null},to={type:"childremoved",child:null},Nt=class i extends gn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Fu++}),this.uuid=qi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new P,t=new Rn,n=new _n,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new mt},normalMatrix:{value:new Fe}}),this.matrix=new mt,this.matrixWorld=new mt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new gs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return xi.setFromAxisAngle(e,t),this.quaternion.multiply(xi),this}rotateOnWorldAxis(e,t){return xi.setFromAxisAngle(e,t),this.quaternion.premultiply(xi),this}rotateX(e){return this.rotateOnAxis(Jl,e)}rotateY(e){return this.rotateOnAxis($l,e)}rotateZ(e){return this.rotateOnAxis(Kl,e)}translateOnAxis(e,t){return Zl.copy(e).applyQuaternion(this.quaternion),this.position.add(Zl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Jl,e)}translateY(e){return this.translateOnAxis($l,e)}translateZ(e){return this.translateOnAxis(Kl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Sn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Js.copy(e):Js.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),rs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Sn.lookAt(rs,Js,this.up):Sn.lookAt(Js,rs,this.up),this.quaternion.setFromRotationMatrix(Sn),s&&(Sn.extractRotation(s.matrixWorld),xi.setFromRotationMatrix(Sn),this.quaternion.premultiply(xi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(De("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ql),yi.child=e,this.dispatchEvent(yi),yi.child=null):De("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(zu),to.child=e,this.dispatchEvent(to),to.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Sn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Sn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Sn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ql),yi.child=e,this.dispatchEvent(yi),yi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,e,Ou),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,Bu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){let d=c[l];r(e.shapes,d)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){let o=a(e.geometries),c=a(e.materials),l=a(e.textures),u=a(e.images),d=a(e.shapes),h=a(e.skeletons),m=a(e.animations),x=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),h.length>0&&(n.skeletons=h),m.length>0&&(n.animations=m),x.length>0&&(n.nodes=x)}return n.object=s,n;function a(o){let c=[];for(let l in o){let u=o[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Nt.DEFAULT_UP=new P(0,1,0);Nt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Nt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Wt=class extends Nt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Vu={type:"move"},Fi=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Wt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Wt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Wt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(let S of e.hand.values()){let p=t.getJointPose(S,n),f=this._getHandJoint(l,S);p!==null&&(f.matrix.fromArray(p.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=p.radius),f.visible=p!==null}let u=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],h=u.position.distanceTo(d.position),m=.02,x=.005;l.inputState.pinching&&h>m+x?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&h<=m-x&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Vu)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Wt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Yc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},On={h:0,s:0,l:0},$s={h:0,s:0,l:0};function no(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Pe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Rt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,$e.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=$e.workingColorSpace){return this.r=e,this.g=t,this.b=n,$e.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=$e.workingColorSpace){if(e=Ko(e,1),t=Ke(t,0,1),n=Ke(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=no(a,r,e+1/3),this.g=no(a,r,e),this.b=no(a,r,e-1/3)}return $e.colorSpaceToWorking(this,s),this}setStyle(e,t=Rt){function n(r){r!==void 0&&parseFloat(r)<1&&Le("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Le("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Le("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Rt){let n=Yc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Le("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=An(e.r),this.g=An(e.g),this.b=An(e.b),this}copyLinearToSRGB(e){return this.r=Pi(e.r),this.g=Pi(e.g),this.b=Pi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Rt){return $e.workingToColorSpace(Lt.copy(this),e),Math.round(Ke(Lt.r*255,0,255))*65536+Math.round(Ke(Lt.g*255,0,255))*256+Math.round(Ke(Lt.b*255,0,255))}getHexString(e=Rt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=$e.workingColorSpace){$e.workingToColorSpace(Lt.copy(this),t);let n=Lt.r,s=Lt.g,r=Lt.b,a=Math.max(n,s,r),o=Math.min(n,s,r),c,l,u=(o+a)/2;if(o===a)c=0,l=0;else{let d=a-o;switch(l=u<=.5?d/(a+o):d/(2-a-o),a){case n:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-n)/d+2;break;case r:c=(n-s)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=$e.workingColorSpace){return $e.workingToColorSpace(Lt.copy(this),t),e.r=Lt.r,e.g=Lt.g,e.b=Lt.b,e}getStyle(e=Rt){$e.workingToColorSpace(Lt.copy(this),e);let t=Lt.r,n=Lt.g,s=Lt.b;return e!==Rt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(On),this.setHSL(On.h+e,On.s+t,On.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(On),e.getHSL($s);let n=hs(On.h,$s.h,t),s=hs(On.s,$s.s,t),r=hs(On.l,$s.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Lt=new Pe;Pe.NAMES=Yc;var ai=class extends Nt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Rn,this.environmentIntensity=1,this.environmentRotation=new Rn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},tn=new P,bn=new P,io=new P,En=new P,vi=new P,Mi=new P,jl=new P,so=new P,ro=new P,ao=new P,oo=new pt,lo=new pt,co=new pt,Hn=class i{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),tn.subVectors(e,t),s.cross(tn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){tn.subVectors(s,t),bn.subVectors(n,t),io.subVectors(e,t);let a=tn.dot(tn),o=tn.dot(bn),c=tn.dot(io),l=bn.dot(bn),u=bn.dot(io),d=a*l-o*o;if(d===0)return r.set(0,0,0),null;let h=1/d,m=(l*c-o*u)*h,x=(a*u-o*c)*h;return r.set(1-m-x,x,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,En)===null?!1:En.x>=0&&En.y>=0&&En.x+En.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,En)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,En.x),c.addScaledVector(a,En.y),c.addScaledVector(o,En.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return oo.setScalar(0),lo.setScalar(0),co.setScalar(0),oo.fromBufferAttribute(e,t),lo.fromBufferAttribute(e,n),co.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(oo,r.x),a.addScaledVector(lo,r.y),a.addScaledVector(co,r.z),a}static isFrontFacing(e,t,n,s){return tn.subVectors(n,t),bn.subVectors(e,t),tn.cross(bn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return tn.subVectors(this.c,this.b),bn.subVectors(this.a,this.b),tn.cross(bn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;vi.subVectors(s,n),Mi.subVectors(r,n),so.subVectors(e,n);let c=vi.dot(so),l=Mi.dot(so);if(c<=0&&l<=0)return t.copy(n);ro.subVectors(e,s);let u=vi.dot(ro),d=Mi.dot(ro);if(u>=0&&d<=u)return t.copy(s);let h=c*d-u*l;if(h<=0&&c>=0&&u<=0)return a=c/(c-u),t.copy(n).addScaledVector(vi,a);ao.subVectors(e,r);let m=vi.dot(ao),x=Mi.dot(ao);if(x>=0&&m<=x)return t.copy(r);let S=m*l-c*x;if(S<=0&&l>=0&&x<=0)return o=l/(l-x),t.copy(n).addScaledVector(Mi,o);let p=u*x-m*d;if(p<=0&&d-u>=0&&m-x>=0)return jl.subVectors(r,s),o=(d-u)/(d-u+(m-x)),t.copy(s).addScaledVector(jl,o);let f=1/(p+S+h);return a=S*f,o=h*f,t.copy(n).addScaledVector(vi,a).addScaledVector(Mi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},xn=class{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(nn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(nn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=nn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,nn):nn.fromBufferAttribute(r,a),nn.applyMatrix4(e.matrixWorld),this.expandByPoint(nn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ks.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ks.copy(n.boundingBox)),Ks.applyMatrix4(e.matrixWorld),this.union(Ks)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,nn),nn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(as),Qs.subVectors(this.max,as),Si.subVectors(e.a,as),bi.subVectors(e.b,as),Ei.subVectors(e.c,as),Bn.subVectors(bi,Si),zn.subVectors(Ei,bi),ti.subVectors(Si,Ei);let t=[0,-Bn.z,Bn.y,0,-zn.z,zn.y,0,-ti.z,ti.y,Bn.z,0,-Bn.x,zn.z,0,-zn.x,ti.z,0,-ti.x,-Bn.y,Bn.x,0,-zn.y,zn.x,0,-ti.y,ti.x,0];return!ho(t,Si,bi,Ei,Qs)||(t=[1,0,0,0,1,0,0,0,1],!ho(t,Si,bi,Ei,Qs))?!1:(js.crossVectors(Bn,zn),t=[js.x,js.y,js.z],ho(t,Si,bi,Ei,Qs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,nn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(nn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Tn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Tn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Tn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Tn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Tn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Tn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Tn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Tn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Tn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Tn=[new P,new P,new P,new P,new P,new P,new P,new P],nn=new P,Ks=new xn,Si=new P,bi=new P,Ei=new P,Bn=new P,zn=new P,ti=new P,as=new P,Qs=new P,js=new P,ni=new P;function ho(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){ni.fromArray(i,r);let o=s.x*Math.abs(ni.x)+s.y*Math.abs(ni.y)+s.z*Math.abs(ni.z),c=e.dot(ni),l=t.dot(ni),u=n.dot(ni);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}var yt=new P,er=new ke,Hu=0,Tt=class extends gn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Hu++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=kc,this.updateRanges=[],this.gpuType=cn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)er.fromBufferAttribute(this,t),er.applyMatrix3(e),this.setXY(t,er.x,er.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix3(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix4(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.applyNormalMatrix(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.transformDirection(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ci(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ft(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ci(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ci(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ci(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ci(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ft(t,this.array),n=Ft(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Ft(t,this.array),n=Ft(n,this.array),s=Ft(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Ft(t,this.array),n=Ft(n,this.array),s=Ft(s,this.array),r=Ft(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var _s=class extends Tt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var xs=class extends Tt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var st=class extends Tt{constructor(e,t,n){super(new Float32Array(e),t,n)}},ku=new xn,os=new P,uo=new P,Oi=class{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):ku.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;os.subVectors(e,this.center);let t=os.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(os,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(uo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(os.copy(e.center).add(uo)),this.expandByPoint(os.copy(e.center).sub(uo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Gu=0,$t=new mt,fo=new Nt,Ti=new P,Gt=new xn,ls=new xn,Et=new P,At=class i extends gn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Gu++}),this.uuid=qi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(fu(e)?xs:_s)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Fe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return $t.makeRotationFromQuaternion(e),this.applyMatrix4($t),this}rotateX(e){return $t.makeRotationX(e),this.applyMatrix4($t),this}rotateY(e){return $t.makeRotationY(e),this.applyMatrix4($t),this}rotateZ(e){return $t.makeRotationZ(e),this.applyMatrix4($t),this}translate(e,t,n){return $t.makeTranslation(e,t,n),this.applyMatrix4($t),this}scale(e,t,n){return $t.makeScale(e,t,n),this.applyMatrix4($t),this}lookAt(e){return fo.lookAt(e),fo.updateMatrix(),this.applyMatrix4(fo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ti).negate(),this.translate(Ti.x,Ti.y,Ti.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new st(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Le("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new xn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){De("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];Gt.setFromBufferAttribute(r),this.morphTargetsRelative?(Et.addVectors(this.boundingBox.min,Gt.min),this.boundingBox.expandByPoint(Et),Et.addVectors(this.boundingBox.max,Gt.max),this.boundingBox.expandByPoint(Et)):(this.boundingBox.expandByPoint(Gt.min),this.boundingBox.expandByPoint(Gt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&De('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Oi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){De("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){let n=this.boundingSphere.center;if(Gt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];ls.setFromBufferAttribute(o),this.morphTargetsRelative?(Et.addVectors(Gt.min,ls.min),Gt.expandByPoint(Et),Et.addVectors(Gt.max,ls.max),Gt.expandByPoint(Et)):(Gt.expandByPoint(ls.min),Gt.expandByPoint(ls.max))}Gt.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Et.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Et));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)Et.fromBufferAttribute(o,l),c&&(Ti.fromBufferAttribute(e,l),Et.add(Ti)),s=Math.max(s,n.distanceToSquared(Et))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&De('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){De("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Tt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],c=[];for(let _=0;_<n.count;_++)o[_]=new P,c[_]=new P;let l=new P,u=new P,d=new P,h=new ke,m=new ke,x=new ke,S=new P,p=new P;function f(_,E,C){l.fromBufferAttribute(n,_),u.fromBufferAttribute(n,E),d.fromBufferAttribute(n,C),h.fromBufferAttribute(r,_),m.fromBufferAttribute(r,E),x.fromBufferAttribute(r,C),u.sub(l),d.sub(l),m.sub(h),x.sub(h);let U=1/(m.x*x.y-x.x*m.y);isFinite(U)&&(S.copy(u).multiplyScalar(x.y).addScaledVector(d,-m.y).multiplyScalar(U),p.copy(d).multiplyScalar(m.x).addScaledVector(u,-x.x).multiplyScalar(U),o[_].add(S),o[E].add(S),o[C].add(S),c[_].add(p),c[E].add(p),c[C].add(p))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let _=0,E=M.length;_<E;++_){let C=M[_],U=C.start,F=C.count;for(let B=U,I=U+F;B<I;B+=3)f(e.getX(B+0),e.getX(B+1),e.getX(B+2))}let A=new P,v=new P,b=new P,T=new P;function R(_){b.fromBufferAttribute(s,_),T.copy(b);let E=o[_];A.copy(E),A.sub(b.multiplyScalar(b.dot(E))).normalize(),v.crossVectors(T,E);let U=v.dot(c[_])<0?-1:1;a.setXYZW(_,A.x,A.y,A.z,U)}for(let _=0,E=M.length;_<E;++_){let C=M[_],U=C.start,F=C.count;for(let B=U,I=U+F;B<I;B+=3)R(e.getX(B+0)),R(e.getX(B+1)),R(e.getX(B+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Tt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,m=n.count;h<m;h++)n.setXYZ(h,0,0,0);let s=new P,r=new P,a=new P,o=new P,c=new P,l=new P,u=new P,d=new P;if(e)for(let h=0,m=e.count;h<m;h+=3){let x=e.getX(h+0),S=e.getX(h+1),p=e.getX(h+2);s.fromBufferAttribute(t,x),r.fromBufferAttribute(t,S),a.fromBufferAttribute(t,p),u.subVectors(a,r),d.subVectors(s,r),u.cross(d),o.fromBufferAttribute(n,x),c.fromBufferAttribute(n,S),l.fromBufferAttribute(n,p),o.add(u),c.add(u),l.add(u),n.setXYZ(x,o.x,o.y,o.z),n.setXYZ(S,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let h=0,m=t.count;h<m;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),u.subVectors(a,r),d.subVectors(s,r),u.cross(d),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Et.fromBufferAttribute(e,t),Et.normalize(),e.setXYZ(t,Et.x,Et.y,Et.z)}toNonIndexed(){function e(o,c){let l=o.array,u=o.itemSize,d=o.normalized,h=new l.constructor(c.length*u),m=0,x=0;for(let S=0,p=c.length;S<p;S++){o.isInterleavedBufferAttribute?m=c[S]*o.data.stride+o.offset:m=c[S]*u;for(let f=0;f<u;f++)h[x++]=l[m++]}return new Tt(h,u,d)}if(this.index===null)return Le("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let c=s[o],l=e(c,n);t.setAttribute(o,l)}let r=this.morphAttributes;for(let o in r){let c=[],l=r[o];for(let u=0,d=l.length;u<d;u++){let h=l[u],m=e(h,n);c.push(m)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],u=[];for(let d=0,h=l.length;d<h;d++){let m=l[d];u.push(m.toJSON(e.data))}u.length>0&&(s[c]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let l in s){let u=s[l];this.setAttribute(l,u.clone(t))}let r=e.morphAttributes;for(let l in r){let u=[],d=r[l];for(let h=0,m=d.length;h<m;h++)u.push(d[h].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let l=0,u=a.length;l<u;l++){let d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var po=new P,Wu=new P,Xu=new Fe,sn=class{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=po.subVectors(n,t).cross(Wu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(po),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Xu.getNormalMatrix(e),s=this.coplanarPoint(po).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},qu=0,kn=class extends gn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:qu++}),this.uuid=qi(),this.name="",this.type="Material",this.blending=ki,this.side=Jn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Po,this.blendDst=Io,this.blendEquation=hi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Pe(0,0,0),this.blendAlpha=0,this.depthFunc=Ii,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Uc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=pr,this.stencilZFail=pr,this.stencilZPass=pr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Le(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Le(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Pe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new sn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ke().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ke().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var wn=new P,mo=new P,tr=new P,nr=new P,Rr=class{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,wn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=wn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(wn.copy(this.origin).addScaledVector(this.direction,t),wn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){mo.copy(e).add(t).multiplyScalar(.5),tr.copy(t).sub(e).normalize(),nr.copy(this.origin).sub(mo);let r=e.distanceTo(t)*.5,a=-this.direction.dot(tr),o=nr.dot(this.direction),c=-nr.dot(tr),l=nr.lengthSq(),u=Math.abs(1-a*a),d,h,m,x;if(u>0)if(d=a*c-o,h=a*o-c,x=r*u,d>=0)if(h>=-x)if(h<=x){let S=1/u;d*=S,h*=S,m=d*(d+a*h+2*o)+h*(a*d+h+2*c)+l}else h=r,d=Math.max(0,-(a*h+o)),m=-d*d+h*(h+2*c)+l;else h=-r,d=Math.max(0,-(a*h+o)),m=-d*d+h*(h+2*c)+l;else h<=-x?(d=Math.max(0,-(-a*r+o)),h=d>0?-r:Math.min(Math.max(-r,-c),r),m=-d*d+h*(h+2*c)+l):h<=x?(d=0,h=Math.min(Math.max(-r,-c),r),m=h*(h+2*c)+l):(d=Math.max(0,-(a*r+o)),h=d>0?r:Math.min(Math.max(-r,-c),r),m=-d*d+h*(h+2*c)+l);else h=a>0?-r:r,d=Math.max(0,-(a*h+o)),m=-d*d+h*(h+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(mo).addScaledVector(tr,h),m}intersectSphere(e,t){if(e.radius<0)return null;wn.subVectors(e.center,this.origin);let n=wn.dot(this.direction),s=wn.dot(wn)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c,l=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return l>=0?(n=(e.min.x-h.x)*l,s=(e.max.x-h.x)*l):(n=(e.max.x-h.x)*l,s=(e.min.x-h.x)*l),u>=0?(r=(e.min.y-h.y)*u,a=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,a=(e.min.y-h.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(e.min.z-h.z)*d,c=(e.max.z-h.z)*d):(o=(e.max.z-h.z)*d,c=(e.min.z-h.z)*d),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,wn)!==null}intersectTriangle(e,t,n,s,r){let a=this.origin,o=this.direction,c=o.x,l=o.y,u=o.z,d=e.x-a.x,h=e.y-a.y,m=e.z-a.z,x=t.x-a.x,S=t.y-a.y,p=t.z-a.z,f=n.x-a.x,M=n.y-a.y,A=n.z-a.z,v=Math.abs(c),b=Math.abs(l),T=Math.abs(u),R,_,E,C,U,F,B,I,k,G,q,ne;if(v>=b&&v>=T?(E=c,F=d,k=x,ne=f,c>=0?(R=l,_=u,C=h,U=m,B=S,I=p,G=M,q=A):(R=u,_=l,C=m,U=h,B=p,I=S,G=A,q=M)):b>=T?(E=l,F=h,k=S,ne=M,l>=0?(R=u,_=c,C=m,U=d,B=p,I=x,G=A,q=f):(R=c,_=u,C=d,U=m,B=x,I=p,G=f,q=A)):(E=u,F=m,k=p,ne=A,u>=0?(R=c,_=l,C=d,U=h,B=x,I=S,G=f,q=M):(R=l,_=c,C=h,U=d,B=S,I=x,G=M,q=f)),E===0)return null;let Y=R/E,j=_/E,ee=1/E,Me=C-Y*F,we=U-j*F,at=B-Y*k,ze=I-j*k,je=G-Y*ne,J=q-j*ne,Q=je*ze-J*at,_e=Me*J-we*je,Ue=at*we-ze*Me;if(s){if(Q<0||_e<0||Ue<0)return null}else if((Q<0||_e<0||Ue<0)&&(Q>0||_e>0||Ue>0))return null;let me=Q+_e+Ue;if(me===0)return null;let Ve=ee*(Q*F+_e*k+Ue*ne);return(me>0?Ve<0:Ve>0)?null:this.at(Ve/me,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},an=class extends kn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Pe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.combine=Lo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},ec=new mt,ii=new Rr,ir=new Oi,tc=new P,sr=new P,rr=new P,ar=new P,go=new P,or=new P,nc=new P,lr=new P,rt=class extends Nt{constructor(e=new At,t=new an){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){or.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let u=o[c],d=r[c];u!==0&&(go.fromBufferAttribute(d,e),a?or.addScaledVector(go,u):or.addScaledVector(go.sub(t),u))}t.add(or)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ir.copy(n.boundingSphere),ir.applyMatrix4(r),ii.copy(e.ray).recast(e.near),!(ir.containsPoint(ii.origin)===!1&&(ii.intersectSphere(ir,tc)===null||ii.origin.distanceToSquared(tc)>(e.far-e.near)**2))&&(ec.copy(r).invert(),ii.copy(e.ray).applyMatrix4(ec),!(n.boundingBox!==null&&ii.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ii)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,h=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,S=h.length;x<S;x++){let p=h[x],f=a[p.materialIndex],M=Math.max(p.start,m.start),A=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let v=M,b=A;v<b;v+=3){let T=o.getX(v),R=o.getX(v+1),_=o.getX(v+2);s=cr(this,f,e,n,l,u,d,T,R,_),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let x=Math.max(0,m.start),S=Math.min(o.count,m.start+m.count);for(let p=x,f=S;p<f;p+=3){let M=o.getX(p),A=o.getX(p+1),v=o.getX(p+2);s=cr(this,a,e,n,l,u,d,M,A,v),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let x=0,S=h.length;x<S;x++){let p=h[x],f=a[p.materialIndex],M=Math.max(p.start,m.start),A=Math.min(c.count,Math.min(p.start+p.count,m.start+m.count));for(let v=M,b=A;v<b;v+=3){let T=v,R=v+1,_=v+2;s=cr(this,f,e,n,l,u,d,T,R,_),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let x=Math.max(0,m.start),S=Math.min(c.count,m.start+m.count);for(let p=x,f=S;p<f;p+=3){let M=p,A=p+1,v=p+2;s=cr(this,a,e,n,l,u,d,M,A,v),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}};function Yu(i,e,t,n,s,r,a,o){let c;if(e.side===zt?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===Jn,o),c===null)return null;lr.copy(o),lr.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(lr);return l<t.near||l>t.far?null:{distance:l,point:lr.clone(),object:i}}function cr(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,sr),i.getVertexPosition(c,rr),i.getVertexPosition(l,ar);let u=Yu(i,e,t,n,sr,rr,ar,nc);if(u){let d=new P;Hn.getBarycoord(nc,sr,rr,ar,d),s&&(u.uv=Hn.getInterpolatedAttribute(s,o,c,l,d,new ke)),r&&(u.uv1=Hn.getInterpolatedAttribute(r,o,c,l,d,new ke)),a&&(u.normal=Hn.getInterpolatedAttribute(a,o,c,l,d,new P),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let h={a:o,b:c,c:l,normal:new P,materialIndex:0};Hn.getNormal(sr,rr,ar,h.normal),u.face=h,u.barycoord=d}return u}var Cr=class extends Ot{constructor(e=null,t=1,n=1,s,r,a,o,c,l=wt,u=wt,d,h){super(null,a,o,c,l,u,s,r,d,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var si=new Oi,Zu=new ke(.5,.5),hr=new P,Bi=class{constructor(e=new sn,t=new sn,n=new sn,s=new sn,r=new sn,a=new sn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=rn,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],u=r[4],d=r[5],h=r[6],m=r[7],x=r[8],S=r[9],p=r[10],f=r[11],M=r[12],A=r[13],v=r[14],b=r[15];if(s[0].setComponents(l-a,m-u,f-x,b-M).normalize(),s[1].setComponents(l+a,m+u,f+x,b+M).normalize(),s[2].setComponents(l+o,m+d,f+S,b+A).normalize(),s[3].setComponents(l-o,m-d,f-S,b-A).normalize(),n)s[4].setComponents(c,h,p,v).normalize(),s[5].setComponents(l-c,m-h,f-p,b-v).normalize();else if(s[4].setComponents(l-c,m-h,f-p,b-v).normalize(),t===rn)s[5].setComponents(l+c,m+h,f+p,b+v).normalize();else if(t===Li)s[5].setComponents(c,h,p,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),si.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),si.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(si)}intersectsSprite(e){si.center.set(0,0,0);let t=Zu.distanceTo(e.center);return si.radius=.7071067811865476+t,si.applyMatrix4(e.matrixWorld),this.intersectsSphere(si)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(hr.x=s.normal.x>0?e.max.x:e.min.x,hr.y=s.normal.y>0?e.max.y:e.min.y,hr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(hr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var ys=class extends Ot{constructor(e=[],t=$n,n,s,r,a,o,c,l,u){super(e,t,n,s,r,a,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},vs=class extends Ot{constructor(e,t,n,s,r,a,o,c,l){super(e,t,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Gn=class extends Ot{constructor(e,t,n=ln,s,r,a,o=wt,c=wt,l,u=mn,d=1){if(u!==mn&&u!==Qn)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:d};super(h,s,r,a,o,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ui(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Pr=class extends Gn{constructor(e,t=ln,n=$n,s,r,a=wt,o=wt,c,l=mn){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,s,r,a,o,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Ms=class extends Ot{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Wn=class i extends At{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],l=[],u=[],d=[],h=0,m=0;x("z","y","x",-1,-1,n,t,e,a,r,0),x("z","y","x",1,-1,n,t,-e,a,r,1),x("x","z","y",1,1,e,n,t,s,a,2),x("x","z","y",1,-1,e,n,-t,s,a,3),x("x","y","z",1,-1,e,t,n,s,r,4),x("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new st(l,3)),this.setAttribute("normal",new st(u,3)),this.setAttribute("uv",new st(d,2));function x(S,p,f,M,A,v,b,T,R,_,E){let C=v/R,U=b/_,F=v/2,B=b/2,I=T/2,k=R+1,G=_+1,q=0,ne=0,Y=new P;for(let j=0;j<G;j++){let ee=j*U-B;for(let Me=0;Me<k;Me++){let we=Me*C-F;Y[S]=we*M,Y[p]=ee*A,Y[f]=I,l.push(Y.x,Y.y,Y.z),Y[S]=0,Y[p]=0,Y[f]=T>0?1:-1,u.push(Y.x,Y.y,Y.z),d.push(Me/R),d.push(1-j/_),q+=1}}for(let j=0;j<_;j++)for(let ee=0;ee<R;ee++){let Me=h+ee+k*j,we=h+ee+k*(j+1),at=h+(ee+1)+k*(j+1),ze=h+(ee+1)+k*j;c.push(Me,we,ze),c.push(we,at,ze),ne+=6}o.addGroup(m,ne,E),m+=ne,h+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}},Ss=class i extends At{constructor(e=1,t=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:s,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let a=[],o=[],c=[],l=[],u=t/2,d=Math.PI/2*e,h=t,m=2*d+h,x=n*2+r,S=s+1,p=new P,f=new P;for(let M=0;M<=x;M++){let A=0,v=0,b=0,T=0;if(M<=n){let E=M/n,C=E*Math.PI/2;v=-u-e*Math.cos(C),b=e*Math.sin(C),T=-e*Math.cos(C),A=E*d}else if(M<=n+r){let E=(M-n)/r;v=-u+E*t,b=e,T=0,A=d+E*h}else{let E=(M-n-r)/n,C=E*Math.PI/2;v=u+e*Math.sin(C),b=e*Math.cos(C),T=e*Math.sin(C),A=d+h+E*d}let R=Math.max(0,Math.min(1,A/m)),_=0;M===0?_=.5/s:M===x&&(_=-.5/s);for(let E=0;E<=s;E++){let C=E/s,U=C*Math.PI*2,F=Math.sin(U),B=Math.cos(U);f.x=-b*B,f.y=v,f.z=b*F,o.push(f.x,f.y,f.z),p.set(-b*B,T,b*F),p.normalize(),c.push(p.x,p.y,p.z),l.push(C+_,R)}if(M>0){let E=(M-1)*S;for(let C=0;C<s;C++){let U=E+C,F=E+C+1,B=M*S+C,I=M*S+C+1;a.push(U,F,B),a.push(F,I,B)}}}this.setIndex(a),this.setAttribute("position",new st(o,3)),this.setAttribute("normal",new st(c,3)),this.setAttribute("uv",new st(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}},bs=class i extends At{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],a=[],o=[],c=[],l=new P,u=new ke;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let d=0,h=3;d<=t;d++,h+=3){let m=n+d/t*s;l.x=e*Math.cos(m),l.y=e*Math.sin(m),a.push(l.x,l.y,l.z),o.push(0,0,1),u.x=(a[h]/e+1)/2,u.y=(a[h+1]/e+1)/2,c.push(u.x,u.y)}for(let d=1;d<=t;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new st(a,3)),this.setAttribute("normal",new st(o,3)),this.setAttribute("uv",new st(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Ir=class i extends At{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let u=[],d=[],h=[],m=[],x=0,S=[],p=n/2,f=0;M(),a===!1&&(e>0&&A(!0),t>0&&A(!1)),this.setIndex(u),this.setAttribute("position",new st(d,3)),this.setAttribute("normal",new st(h,3)),this.setAttribute("uv",new st(m,2));function M(){let v=new P,b=new P,T=0,R=(t-e)/n;for(let _=0;_<=r;_++){let E=[],C=_/r,U=C*(t-e)+e;for(let F=0;F<=s;F++){let B=F/s,I=B*c+o,k=Math.sin(I),G=Math.cos(I);b.x=U*k,b.y=-C*n+p,b.z=U*G,d.push(b.x,b.y,b.z),v.set(k,R,G).normalize(),h.push(v.x,v.y,v.z),m.push(B,1-C),E.push(x++)}S.push(E)}for(let _=0;_<s;_++)for(let E=0;E<r;E++){let C=S[E][_],U=S[E+1][_],F=S[E+1][_+1],B=S[E][_+1];(e>0||E!==0)&&(u.push(C,U,B),T+=3),(t>0||E!==r-1)&&(u.push(U,F,B),T+=3)}l.addGroup(f,T,0),f+=T}function A(v){let b=x,T=new ke,R=new P,_=0,E=v===!0?e:t,C=v===!0?1:-1;for(let F=1;F<=s;F++)d.push(0,p*C,0),h.push(0,C,0),m.push(.5,.5),x++;let U=x;for(let F=0;F<=s;F++){let I=F/s*c+o,k=Math.cos(I),G=Math.sin(I);R.x=E*G,R.y=p*C,R.z=E*k,d.push(R.x,R.y,R.z),h.push(0,C,0),T.x=k*.5+.5,T.y=G*.5*C+.5,m.push(T.x,T.y),x++}for(let F=0;F<s;F++){let B=b+F,I=U+F;v===!0?u.push(I,I+1,B):u.push(I+1,I,B),_+=3}l.addGroup(f,_,v===!0?1:2),f+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Es=class i extends Ir{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Lr=class i extends At{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),l(n),u(),this.setAttribute("position",new st(r,3)),this.setAttribute("normal",new st(r.slice(),3)),this.setAttribute("uv",new st(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(M){let A=new P,v=new P,b=new P;for(let T=0;T<t.length;T+=3)m(t[T+0],A),m(t[T+1],v),m(t[T+2],b),c(A,v,b,M)}function c(M,A,v,b){let T=b+1,R=[];for(let _=0;_<=T;_++){R[_]=[];let E=M.clone().lerp(v,_/T),C=A.clone().lerp(v,_/T),U=T-_;for(let F=0;F<=U;F++)F===0&&_===T?R[_][F]=E:R[_][F]=E.clone().lerp(C,F/U)}for(let _=0;_<T;_++)for(let E=0;E<2*(T-_)-1;E++){let C=Math.floor(E/2);E%2===0?(h(R[_][C+1]),h(R[_+1][C]),h(R[_][C])):(h(R[_][C+1]),h(R[_+1][C+1]),h(R[_+1][C]))}}function l(M){let A=new P;for(let v=0;v<r.length;v+=3)A.x=r[v+0],A.y=r[v+1],A.z=r[v+2],A.normalize().multiplyScalar(M),r[v+0]=A.x,r[v+1]=A.y,r[v+2]=A.z}function u(){let M=new P;for(let A=0;A<r.length;A+=3){M.x=r[A+0],M.y=r[A+1],M.z=r[A+2];let v=p(M)/2/Math.PI+.5,b=f(M)/Math.PI+.5;a.push(v,1-b)}x(),d()}function d(){for(let M=0;M<a.length;M+=6){let A=a[M+0],v=a[M+2],b=a[M+4],T=Math.max(A,v,b),R=Math.min(A,v,b);T>.9&&R<.1&&(A<.2&&(a[M+0]+=1),v<.2&&(a[M+2]+=1),b<.2&&(a[M+4]+=1))}}function h(M){r.push(M.x,M.y,M.z)}function m(M,A){let v=M*3;A.x=e[v+0],A.y=e[v+1],A.z=e[v+2]}function x(){let M=new P,A=new P,v=new P,b=new P,T=new ke,R=new ke,_=new ke;for(let E=0,C=0;E<r.length;E+=9,C+=6){M.set(r[E+0],r[E+1],r[E+2]),A.set(r[E+3],r[E+4],r[E+5]),v.set(r[E+6],r[E+7],r[E+8]),T.set(a[C+0],a[C+1]),R.set(a[C+2],a[C+3]),_.set(a[C+4],a[C+5]),b.copy(M).add(A).add(v).divideScalar(3);let U=p(b);S(T,C+0,M,U),S(R,C+2,A,U),S(_,C+4,v,U)}}function S(M,A,v,b){b<0&&M.x===1&&(a[A]=M.x-1),v.x===0&&v.z===0&&(a[A]=b/2/Math.PI+.5)}function p(M){return Math.atan2(M.z,-M.x)}function f(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.detail)}};var Ts=class i extends Lr{constructor(e=1,t=0){let n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},oi=class i extends At{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,u=c+1,d=e/o,h=t/c,m=[],x=[],S=[],p=[];for(let f=0;f<u;f++){let M=f*h-a;for(let A=0;A<l;A++){let v=A*d-r;x.push(v,-M,0),S.push(0,0,1),p.push(A/o),p.push(1-f/c)}}for(let f=0;f<c;f++)for(let M=0;M<o;M++){let A=M+l*f,v=M+l*(f+1),b=M+1+l*(f+1),T=M+1+l*f;m.push(A,v,T),m.push(v,b,T)}this.setIndex(m),this.setAttribute("position",new st(x,3)),this.setAttribute("normal",new st(S,3)),this.setAttribute("uv",new st(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var on=class i extends At{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let c=Math.min(a+o,Math.PI),l=0,u=[],d=new P,h=new P,m=[],x=[],S=[],p=[];for(let f=0;f<=n;f++){let M=[],A=f/n,v=a+A*o,b=e*Math.cos(v),T=Math.sqrt(e*e-b*b),R=0;f===0&&a===0?R=.5/t:f===n&&c===Math.PI&&(R=-.5/t);for(let _=0;_<=t;_++){let E=_/t,C=s+E*r;d.x=-T*Math.cos(C),d.y=b,d.z=T*Math.sin(C),x.push(d.x,d.y,d.z),h.copy(d).normalize(),S.push(h.x,h.y,h.z),p.push(E+R,1-A),M.push(l++)}u.push(M)}for(let f=0;f<n;f++)for(let M=0;M<t;M++){let A=u[f][M+1],v=u[f][M],b=u[f+1][M],T=u[f+1][M+1];(f!==0||a>0)&&m.push(A,v,T),(f!==n-1||c<Math.PI)&&m.push(v,b,T)}this.setIndex(m),this.setAttribute("position",new st(x,3)),this.setAttribute("normal",new st(S,3)),this.setAttribute("uv",new st(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var ws=class i extends At{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);let c=[],l=[],u=[],d=[],h=new P,m=new P,x=new P;for(let S=0;S<=n;S++){let p=a+S/n*o;for(let f=0;f<=s;f++){let M=f/s*r;m.x=(e+t*Math.cos(p))*Math.cos(M),m.y=(e+t*Math.cos(p))*Math.sin(M),m.z=t*Math.sin(p),l.push(m.x,m.y,m.z),h.x=e*Math.cos(M),h.y=e*Math.sin(M),x.subVectors(m,h).normalize(),u.push(x.x,x.y,x.z),d.push(f/s),d.push(S/n)}}for(let S=1;S<=n;S++)for(let p=1;p<=s;p++){let f=(s+1)*S+p-1,M=(s+1)*(S-1)+p-1,A=(s+1)*(S-1)+p,v=(s+1)*S+p;c.push(f,M,v),c.push(M,A,v)}this.setIndex(c),this.setAttribute("position",new st(l,3)),this.setAttribute("normal",new st(u,3)),this.setAttribute("uv",new st(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};function di(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(ic(s))s.isRenderTargetTexture?(Le("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(ic(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function Dt(i){let e={};for(let t=0;t<i.length;t++){let n=di(i[t]);for(let s in n)e[s]=n[s]}return e}function ic(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Ju(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Qo(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:$e.workingColorSpace}var Zc={clone:di,merge:Dt},$u=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ku=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Bt=class extends kn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=$u,this.fragmentShader=Ku,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=di(e.uniforms),this.uniformsGroups=Ju(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Pe().setHex(s.value);break;case"v2":this.uniforms[n].value=new ke().fromArray(s.value);break;case"v3":this.uniforms[n].value=new P().fromArray(s.value);break;case"v4":this.uniforms[n].value=new pt().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Fe().fromArray(s.value);break;case"m4":this.uniforms[n].value=new mt().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Nr=class extends Bt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Xt=class extends kn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Pe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Pe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Na,this.normalScale=new ke(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var Dr=class extends kn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Nc,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ur=class extends kn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function wi(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function _o(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var Xn=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Fr=class extends Xn{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:vo,endingEnd:vo}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Mo:r=e,o=2*t-n;break;case So:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Mo:a=e,c=2*n-t;break;case So:a=1,c=n+s[1]-s[0];break;default:a=e-1,c=t}let l=(n-t)*.5,u=this.valueSize;this._weightPrev=l/(t-o),this._weightNext=l/(c-n),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,m=this._weightNext,x=(n-t)/(s-t),S=x*x,p=S*x,f=-h*p+2*h*S-h*x,M=(1+h)*p+(-1.5-2*h)*S+(-.5+h)*x+1,A=(-1-m)*p+(1.5+m)*S+.5*x,v=m*p-m*S;for(let b=0;b!==o;++b)r[b]=f*a[u+b]+M*a[l+b]+A*a[c+b]+v*a[d+b];return r}},Or=class extends Xn{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,u=(n-t)/(s-t),d=1-u;for(let h=0;h!==o;++h)r[h]=a[l+h]*d+a[c+h]*u;return r}},Br=class extends Xn{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},zr=class extends Xn{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,u=this.inTangents,d=this.outTangents;if(!u||!d){let x=(n-t)/(s-t),S=1-x;for(let p=0;p!==o;++p)r[p]=a[l+p]*S+a[c+p]*x;return r}let h=o*2,m=e-1;for(let x=0;x!==o;++x){let S=a[l+x],p=a[c+x],f=m*h+x*2,M=d[f],A=d[f+1],v=e*h+x*2,b=u[v],T=u[v+1],R=ju(n,t,M,b,s);r[x]=Jc(R,S,A,T,p)}return r}};function Jc(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function Qu(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function ju(i,e,t,n,s){let r=(i-e)/(s-e);for(let a=0;a<8;a++){let o=Jc(r,e,t,n,s)-i;if(Math.abs(o)<1e-10)break;let c=Qu(r,e,t,n,s);if(Math.abs(c)<1e-10)break;r=Math.max(0,Math.min(1,r-o/c))}return r}var qt=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=wi(t,this.TimeBufferType),this.values=wi(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:wi(e.times,Array),values:wi(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),_o(e.settings)&&(n.settings={inTangents:wi(e.settings.inTangents,Array),outTangents:wi(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Br(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Or(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Fr(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new zr(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case us:t=this.InterpolantFactoryMethodDiscrete;break;case Er:t=this.InterpolantFactoryMethodLinear;break;case fr:t=this.InterpolantFactoryMethodSmooth;break;case yo:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Le("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return us;case this.InterpolantFactoryMethodLinear:return Er;case this.InterpolantFactoryMethodSmooth:return fr;case this.InterpolantFactoryMethodBezier:return yo}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;_o(this.settings)&&(sc(this.settings.inTangents,e),sc(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(De("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(De("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let c=n[o];if(typeof c=="number"&&isNaN(c)){De("KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(a!==null&&a>c){De("KeyframeTrack: Out of order keys.",this,o,c,a),e=!1;break}a=c}if(s!==void 0&&pu(s))for(let o=0,c=s.length;o!==c;++o){let l=s[o];if(isNaN(l)){De("KeyframeTrack: Value is not a valid number.",this,o,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===fr,r=e.length-1,a=1;for(let o=1;o<r;++o){let c=!1,l=e[o],u=e[o+1];if(l!==u&&(o!==1||l!==e[0]))if(s)c=!0;else{let d=o*n,h=d-n,m=d+n;for(let x=0;x!==n;++x){let S=t[d+x];if(S!==t[h+x]||S!==t[m+x]){c=!0;break}}}if(c){if(o!==a){e[a]=e[o];let d=o*n,h=a*n;for(let m=0;m!==n;++m)t[h+m]=t[d+m]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)t[c+l]=t[o+l];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,_o(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function sc(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}qt.prototype.ValueTypeName="";qt.prototype.TimeBufferType=Float32Array;qt.prototype.ValueBufferType=Float32Array;qt.prototype.DefaultInterpolation=Er;var qn=class extends qt{constructor(e,t,n){super(e,t,n)}};qn.prototype.ValueTypeName="bool";qn.prototype.ValueBufferType=Array;qn.prototype.DefaultInterpolation=us;qn.prototype.InterpolantFactoryMethodLinear=void 0;qn.prototype.InterpolantFactoryMethodSmooth=void 0;var Vr=class extends qt{constructor(e,t,n,s){super(e,t,n,s)}};Vr.prototype.ValueTypeName="color";var Hr=class extends qt{constructor(e,t,n,s){super(e,t,n,s)}};Hr.prototype.ValueTypeName="number";var kr=class extends Xn{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-t)/(s-t),l=e*o;for(let u=l+o;l!==u;l+=4)_n.slerpFlat(r,0,a,l-o,a,l,c);return r}},As=class extends qt{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new kr(this.times,this.values,this.getValueSize(),e)}};As.prototype.ValueTypeName="quaternion";As.prototype.InterpolantFactoryMethodSmooth=void 0;var Yn=class extends qt{constructor(e,t,n){super(e,t,n)}};Yn.prototype.ValueTypeName="string";Yn.prototype.ValueBufferType=Array;Yn.prototype.DefaultInterpolation=us;Yn.prototype.InterpolantFactoryMethodLinear=void 0;Yn.prototype.InterpolantFactoryMethodSmooth=void 0;var Gr=class extends qt{constructor(e,t,n,s){super(e,t,n,s)}};Gr.prototype.ValueTypeName="vector";var Wr=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,d){return l.push(u,d),this},this.removeHandler=function(u){let d=l.indexOf(u);return d!==-1&&l.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=l.length;d<h;d+=2){let m=l[d],x=l[d+1];if(m.global&&(m.lastIndex=0),m.test(u))return x}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},$c=new Wr,Xr=class{constructor(e){this.manager=e!==void 0?e:$c,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Xr.DEFAULT_MATERIAL_NAME="__DEFAULT";var zi=class extends Nt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Pe(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},li=class extends zi{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Nt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Pe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},xo=new mt,rc=new P,ac=new P,Rs=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ke(512,512),this.mapType=Ht,this.map=null,this.mapPass=null,this.matrix=new mt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Bi,this._frameExtents=new ke(1,1),this._viewportCount=1,this._viewports=[new pt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;rc.setFromMatrixPosition(e.matrixWorld),t.position.copy(rc),ac.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ac),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){xo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(xo,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,c=s?s.x/r.x:0,l=s?s.y/r.y:0;e.coordinateSystem===Li||e.reversedDepth?t.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,.5,.5,0,0,0,1),t.multiply(xo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},ur=new P,dr=new _n,fn=new P,Cs=class extends Nt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new mt,this.projectionMatrix=new mt,this.projectionMatrixInverse=new mt,this.coordinateSystem=rn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ur,dr,fn),fn.x===1&&fn.y===1&&fn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ur,dr,fn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(ur,dr,fn),fn.x===1&&fn.y===1&&fn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ur,dr,fn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Vn=new P,oc=new ke,lc=new ke,Mt=class extends Cs{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Di*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(cs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Di*2*Math.atan(Math.tan(cs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Vn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Vn.x,Vn.y).multiplyScalar(-e/Vn.z),Vn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Vn.x,Vn.y).multiplyScalar(-e/Vn.z)}getViewSize(e,t){return this.getViewBounds(e,oc,lc),t.subVectors(lc,oc)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(cs*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var bo=class extends Rs{constructor(){super(new Mt(90,1,.5,500)),this.isPointLightShadow=!0}},ci=class extends zi{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new bo}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Vi=class extends Cs{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Eo=class extends Rs{constructor(){super(new Vi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Zn=class extends zi{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Nt.DEFAULT_UP),this.updateMatrix(),this.target=new Nt,this.shadow=new Eo}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var Ai=-90,Ri=1,qr=class extends Nt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Mt(Ai,Ri,e,t);s.layers=this.layers,this.add(s);let r=new Mt(Ai,Ri,e,t);r.layers=this.layers,this.add(r);let a=new Mt(Ai,Ri,e,t);a.layers=this.layers,this.add(a);let o=new Mt(Ai,Ri,e,t);o.layers=this.layers,this.add(o);let c=new Mt(Ai,Ri,e,t);c.layers=this.layers,this.add(c);let l=new Mt(Ai,Ri,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(let l of t)this.remove(l);if(e===rn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Li)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,l,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;let S=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,4,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),n.texture.generateMipmaps=S,e.setRenderTarget(n,5,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(d,h,m),e.xr.enabled=x,n.texture.needsPMREMUpdate=!0}},Yr=class extends Mt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var jo="\\[\\]\\.:\\/",ed=new RegExp("["+jo+"]","g"),el="[^"+jo+"]",td="[^"+jo.replace("\\.","")+"]",nd=/((?:WC+[\/:])*)/.source.replace("WC",el),id=/(WCOD+)?/.source.replace("WCOD",td),sd=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",el),rd=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",el),ad=new RegExp("^"+nd+id+sd+rd+"$"),od=["material","materials","bones","map"],To=class{constructor(e,t,n){let s=n||ft.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ft=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(ed,"")}static parseTrackName(e){let t=ad.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);od.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let c=n(o.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Le("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){De("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){De("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){De("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===l){l=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){De("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){De("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){De("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){De("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let a=e[s];if(a===void 0){let l=t.nodeName;De("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){De("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){De("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ft.Composite=To;ft.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ft.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ft.prototype.GetterByBindingType=[ft.prototype._getValue_direct,ft.prototype._getValue_array,ft.prototype._getValue_arrayElement,ft.prototype._getValue_toArray];ft.prototype.SetterByBindingTypeAndVersioning=[[ft.prototype._setValue_direct,ft.prototype._setValue_direct_setNeedsUpdate,ft.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_array,ft.prototype._setValue_array_setNeedsUpdate,ft.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_arrayElement,ft.prototype._setValue_arrayElement_setNeedsUpdate,ft.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_fromArray,ft.prototype._setValue_fromArray_setNeedsUpdate,ft.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var N0=new Float32Array(1);var wo=class i{static{i.prototype.isMatrix2=!0}constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};function tl(i,e,t,n){let s=ld(n);switch(t){case Xo:return i*e;case Yo:return i*e/s.components*s.byteLength;case ea:return i*e/s.components*s.byteLength;case jn:return i*e*2/s.components*s.byteLength;case ta:return i*e*2/s.components*s.byteLength;case qo:return i*e*3/s.components*s.byteLength;case Qt:return i*e*4/s.components*s.byteLength;case na:return i*e*4/s.components*s.byteLength;case Ns:case Ds:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Us:case Fs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case sa:case aa:return Math.max(i,16)*Math.max(e,8)/4;case ia:case ra:return Math.max(i,8)*Math.max(e,8)/2;case oa:case la:case ha:case ua:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ca:case Os:case da:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case fa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case pa:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case ma:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case ga:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case _a:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case xa:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case ya:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case va:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ma:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Sa:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case ba:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Ea:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Ta:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case wa:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Aa:case Ra:case Ca:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Pa:case Ia:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Bs:case La:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function ld(i){switch(i){case Ht:case Ho:return{byteLength:1,components:1};case Wi:case ko:case hn:return{byteLength:2,components:1};case Qr:case jr:return{byteLength:2,components:4};case ln:case Kr:case cn:return{byteLength:4,components:1};case Go:case Wo:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Le("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function xh(){let i=null,e=!1,t=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function hd(i){let e=new WeakMap;function t(o,c){let l=o.array,u=o.usage,d=l.byteLength,h=i.createBuffer();i.bindBuffer(c,h),i.bufferData(c,l,u),o.onUploadCallback();let m;if(l instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)m=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)m=i.SHORT;else if(l instanceof Uint32Array)m=i.UNSIGNED_INT;else if(l instanceof Int32Array)m=i.INT;else if(l instanceof Int8Array)m=i.BYTE;else if(l instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:m,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,c,l){let u=c.array,d=c.updateRanges;if(i.bindBuffer(l,o),d.length===0)i.bufferSubData(l,0,u);else{d.sort((m,x)=>m.start-x.start);let h=0;for(let m=1;m<d.length;m++){let x=d[h],S=d[m];S.start<=x.start+x.count+1?x.count=Math.max(x.count,S.start+S.count-x.start):(++h,d[h]=S)}d.length=h+1;for(let m=0,x=d.length;m<x;m++){let S=d[m];i.bufferSubData(l,S.start*u.BYTES_PER_ELEMENT,u,S.start,S.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var ud=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,dd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,fd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,pd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,md=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,gd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,_d=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,xd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,yd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,vd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Md=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Sd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Ed=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Td=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,wd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Ad=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Rd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Cd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Pd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Id=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Ld=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Nd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Dd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Ud=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Fd=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Od=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Bd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,zd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Vd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Hd="gl_FragColor = linearToOutputTexel( gl_FragColor );",kd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Gd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Wd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Xd=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,qd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Yd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Zd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Jd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,$d=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Kd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Qd=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,jd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ef=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,tf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,nf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,sf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,rf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,af=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,of=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,cf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,hf=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,uf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,df=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ff=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,pf=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,mf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,gf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,_f=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,xf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,yf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,vf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Mf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Sf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ef=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Tf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,wf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Af=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Rf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Cf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Pf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,If=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Lf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Nf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Df=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Uf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Ff=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Of=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Bf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,zf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Vf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Hf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,kf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Gf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Wf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Xf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,qf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Yf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Zf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Jf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,$f=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Kf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Qf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,jf=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,ep=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,tp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,np=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ip=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,sp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,rp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,ap=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,op=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,lp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,cp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,hp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,up=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,dp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,fp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,mp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_p=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,yp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,vp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Mp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Sp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,bp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ep=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Tp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,wp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Ap=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Rp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Cp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Pp=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Ip=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Np=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Dp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Up=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Op=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Bp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,zp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Vp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Hp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,kp=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Gp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Wp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Xp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ge={alphahash_fragment:ud,alphahash_pars_fragment:dd,alphamap_fragment:fd,alphamap_pars_fragment:pd,alphatest_fragment:md,alphatest_pars_fragment:gd,aomap_fragment:_d,aomap_pars_fragment:xd,batching_pars_vertex:yd,batching_vertex:vd,begin_vertex:Md,beginnormal_vertex:Sd,bsdfs:bd,iridescence_fragment:Ed,bumpmap_pars_fragment:Td,clipping_planes_fragment:wd,clipping_planes_pars_fragment:Ad,clipping_planes_pars_vertex:Rd,clipping_planes_vertex:Cd,color_fragment:Pd,color_pars_fragment:Id,color_pars_vertex:Ld,color_vertex:Nd,common:Dd,cube_uv_reflection_fragment:Ud,defaultnormal_vertex:Fd,displacementmap_pars_vertex:Od,displacementmap_vertex:Bd,emissivemap_fragment:zd,emissivemap_pars_fragment:Vd,colorspace_fragment:Hd,colorspace_pars_fragment:kd,envmap_fragment:Gd,envmap_common_pars_fragment:Wd,envmap_pars_fragment:Xd,envmap_pars_vertex:qd,envmap_physical_pars_fragment:sf,envmap_vertex:Yd,fog_vertex:Zd,fog_pars_vertex:Jd,fog_fragment:$d,fog_pars_fragment:Kd,gradientmap_pars_fragment:Qd,lightmap_pars_fragment:jd,lights_lambert_fragment:ef,lights_lambert_pars_fragment:tf,lights_pars_begin:nf,lights_toon_fragment:rf,lights_toon_pars_fragment:af,lights_phong_fragment:of,lights_phong_pars_fragment:lf,lights_physical_fragment:cf,lights_physical_pars_fragment:hf,lights_fragment_begin:uf,lights_fragment_maps:df,lights_fragment_end:ff,lightprobes_pars_fragment:pf,logdepthbuf_fragment:mf,logdepthbuf_pars_fragment:gf,logdepthbuf_pars_vertex:_f,logdepthbuf_vertex:xf,map_fragment:yf,map_pars_fragment:vf,map_particle_fragment:Mf,map_particle_pars_fragment:Sf,metalnessmap_fragment:bf,metalnessmap_pars_fragment:Ef,morphinstance_vertex:Tf,morphcolor_vertex:wf,morphnormal_vertex:Af,morphtarget_pars_vertex:Rf,morphtarget_vertex:Cf,normal_fragment_begin:Pf,normal_fragment_maps:If,normal_pars_fragment:Lf,normal_pars_vertex:Nf,normal_vertex:Df,normalmap_pars_fragment:Uf,clearcoat_normal_fragment_begin:Ff,clearcoat_normal_fragment_maps:Of,clearcoat_pars_fragment:Bf,iridescence_pars_fragment:zf,opaque_fragment:Vf,packing:Hf,premultiplied_alpha_fragment:kf,project_vertex:Gf,dithering_fragment:Wf,dithering_pars_fragment:Xf,roughnessmap_fragment:qf,roughnessmap_pars_fragment:Yf,shadowmap_pars_fragment:Zf,shadowmap_pars_vertex:Jf,shadowmap_vertex:$f,shadowmask_pars_fragment:Kf,skinbase_vertex:Qf,skinning_pars_vertex:jf,skinning_vertex:ep,skinnormal_vertex:tp,specularmap_fragment:np,specularmap_pars_fragment:ip,tonemapping_fragment:sp,tonemapping_pars_fragment:rp,transmission_fragment:ap,transmission_pars_fragment:op,uv_pars_fragment:lp,uv_pars_vertex:cp,uv_vertex:hp,worldpos_vertex:up,background_vert:dp,background_frag:fp,backgroundCube_vert:pp,backgroundCube_frag:mp,cube_vert:gp,cube_frag:_p,depth_vert:xp,depth_frag:yp,distance_vert:vp,distance_frag:Mp,equirect_vert:Sp,equirect_frag:bp,linedashed_vert:Ep,linedashed_frag:Tp,meshbasic_vert:wp,meshbasic_frag:Ap,meshlambert_vert:Rp,meshlambert_frag:Cp,meshmatcap_vert:Pp,meshmatcap_frag:Ip,meshnormal_vert:Lp,meshnormal_frag:Np,meshphong_vert:Dp,meshphong_frag:Up,meshphysical_vert:Fp,meshphysical_frag:Op,meshtoon_vert:Bp,meshtoon_frag:zp,points_vert:Vp,points_frag:Hp,shadow_vert:kp,shadow_frag:Gp,sprite_vert:Wp,sprite_frag:Xp},he={common:{diffuse:{value:new Pe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Fe}},envmap:{envMap:{value:null},envMapRotation:{value:new Fe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Fe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Fe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Fe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Fe},normalScale:{value:new ke(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Fe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Fe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Fe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Fe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Pe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new P},probesMax:{value:new P},probesResolution:{value:new P}},points:{diffuse:{value:new Pe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0},uvTransform:{value:new Fe}},sprite:{diffuse:{value:new Pe(16777215)},opacity:{value:1},center:{value:new ke(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}}},Mn={basic:{uniforms:Dt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.fog]),vertexShader:Ge.meshbasic_vert,fragmentShader:Ge.meshbasic_frag},lambert:{uniforms:Dt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Pe(0)},envMapIntensity:{value:1}}]),vertexShader:Ge.meshlambert_vert,fragmentShader:Ge.meshlambert_frag},phong:{uniforms:Dt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Pe(0)},specular:{value:new Pe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphong_vert,fragmentShader:Ge.meshphong_frag},standard:{uniforms:Dt([he.common,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.roughnessmap,he.metalnessmap,he.fog,he.lights,{emissive:{value:new Pe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag},toon:{uniforms:Dt([he.common,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.gradientmap,he.fog,he.lights,{emissive:{value:new Pe(0)}}]),vertexShader:Ge.meshtoon_vert,fragmentShader:Ge.meshtoon_frag},matcap:{uniforms:Dt([he.common,he.bumpmap,he.normalmap,he.displacementmap,he.fog,{matcap:{value:null}}]),vertexShader:Ge.meshmatcap_vert,fragmentShader:Ge.meshmatcap_frag},points:{uniforms:Dt([he.points,he.fog]),vertexShader:Ge.points_vert,fragmentShader:Ge.points_frag},dashed:{uniforms:Dt([he.common,he.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ge.linedashed_vert,fragmentShader:Ge.linedashed_frag},depth:{uniforms:Dt([he.common,he.displacementmap]),vertexShader:Ge.depth_vert,fragmentShader:Ge.depth_frag},normal:{uniforms:Dt([he.common,he.bumpmap,he.normalmap,he.displacementmap,{opacity:{value:1}}]),vertexShader:Ge.meshnormal_vert,fragmentShader:Ge.meshnormal_frag},sprite:{uniforms:Dt([he.sprite,he.fog]),vertexShader:Ge.sprite_vert,fragmentShader:Ge.sprite_frag},background:{uniforms:{uvTransform:{value:new Fe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ge.background_vert,fragmentShader:Ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Fe}},vertexShader:Ge.backgroundCube_vert,fragmentShader:Ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ge.cube_vert,fragmentShader:Ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ge.equirect_vert,fragmentShader:Ge.equirect_frag},distance:{uniforms:Dt([he.common,he.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ge.distance_vert,fragmentShader:Ge.distance_frag},shadow:{uniforms:Dt([he.lights,he.fog,{color:{value:new Pe(0)},opacity:{value:1}}]),vertexShader:Ge.shadow_vert,fragmentShader:Ge.shadow_frag}};Mn.physical={uniforms:Dt([Mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Fe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Fe},clearcoatNormalScale:{value:new ke(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Fe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Fe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Fe},sheen:{value:0},sheenColor:{value:new Pe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Fe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Fe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Fe},transmissionSamplerSize:{value:new ke},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Fe},attenuationDistance:{value:0},attenuationColor:{value:new Pe(0)},specularColor:{value:new Pe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Fe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Fe},anisotropyVector:{value:new ke},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Fe}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag};var Fa={r:0,b:0,g:0},qp=new mt,yh=new Fe;yh.set(-1,0,0,0,1,0,0,0,1);function Yp(i,e,t,n,s,r){let a=new Pe(0),o=s===!0?0:1,c,l,u=null,d=0,h=null;function m(M){let A=M.isScene===!0?M.background:null;if(A&&A.isTexture){let v=M.backgroundBlurriness>0;A=e.get(A,v)}return A}function x(M){let A=!1,v=m(M);v===null?p(a,o):v&&v.isColor&&(p(v,1),A=!0);let b=i.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||A)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function S(M,A){let v=m(A);v&&(v.isCubeTexture||v.mapping===Is)?(l===void 0&&(l=new rt(new Wn(1,1,1),new Bt({name:"BackgroundCubeMaterial",uniforms:di(Mn.backgroundCube.uniforms),vertexShader:Mn.backgroundCube.vertexShader,fragmentShader:Mn.backgroundCube.fragmentShader,side:zt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(b,T,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=v,l.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(qp.makeRotationFromEuler(A.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(yh),l.material.toneMapped=$e.getTransfer(v.colorSpace)!==it,(u!==v||d!==v.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,u=v,d=v.version,h=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new rt(new oi(2,2),new Bt({name:"BackgroundMaterial",uniforms:di(Mn.background.uniforms),vertexShader:Mn.background.vertexShader,fragmentShader:Mn.background.fragmentShader,side:Jn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.toneMapped=$e.getTransfer(v.colorSpace)!==it,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||d!==v.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,u=v,d=v.version,h=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function p(M,A){M.getRGB(Fa,Qo(i)),t.buffers.color.setClear(Fa.r,Fa.g,Fa.b,A,r)}function f(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,A=1){a.set(M),o=A,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,p(a,o)},render:x,addToRenderList:S,dispose:f}}function Zp(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null),r=s,a=!1;function o(U,F,B,I,k){let G=!1,q=d(U,I,B,F);r!==q&&(r=q,l(r.object)),G=m(U,I,B,k),G&&x(U,I,B,k),k!==null&&e.update(k,i.ELEMENT_ARRAY_BUFFER),(G||a)&&(a=!1,v(U,F,B,I),k!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function c(){return i.createVertexArray()}function l(U){return i.bindVertexArray(U)}function u(U){return i.deleteVertexArray(U)}function d(U,F,B,I){let k=I.wireframe===!0,G=n[F.id];G===void 0&&(G={},n[F.id]=G);let q=U.isInstancedMesh===!0?U.id:0,ne=G[q];ne===void 0&&(ne={},G[q]=ne);let Y=ne[B.id];Y===void 0&&(Y={},ne[B.id]=Y);let j=Y[k];return j===void 0&&(j=h(c()),Y[k]=j),j}function h(U){let F=[],B=[],I=[];for(let k=0;k<t;k++)F[k]=0,B[k]=0,I[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:B,attributeDivisors:I,object:U,attributes:{},index:null}}function m(U,F,B,I){let k=r.attributes,G=F.attributes,q=0,ne=B.getAttributes();for(let Y in ne)if(ne[Y].location>=0){let ee=k[Y],Me=G[Y];if(Me===void 0&&(Y==="instanceMatrix"&&U.instanceMatrix&&(Me=U.instanceMatrix),Y==="instanceColor"&&U.instanceColor&&(Me=U.instanceColor)),ee===void 0||ee.attribute!==Me||Me&&ee.data!==Me.data)return!0;q++}return r.attributesNum!==q||r.index!==I}function x(U,F,B,I){let k={},G=F.attributes,q=0,ne=B.getAttributes();for(let Y in ne)if(ne[Y].location>=0){let ee=G[Y];ee===void 0&&(Y==="instanceMatrix"&&U.instanceMatrix&&(ee=U.instanceMatrix),Y==="instanceColor"&&U.instanceColor&&(ee=U.instanceColor));let Me={};Me.attribute=ee,ee&&ee.data&&(Me.data=ee.data),k[Y]=Me,q++}r.attributes=k,r.attributesNum=q,r.index=I}function S(){let U=r.newAttributes;for(let F=0,B=U.length;F<B;F++)U[F]=0}function p(U){f(U,0)}function f(U,F){let B=r.newAttributes,I=r.enabledAttributes,k=r.attributeDivisors;B[U]=1,I[U]===0&&(i.enableVertexAttribArray(U),I[U]=1),k[U]!==F&&(i.vertexAttribDivisor(U,F),k[U]=F)}function M(){let U=r.newAttributes,F=r.enabledAttributes;for(let B=0,I=F.length;B<I;B++)F[B]!==U[B]&&(i.disableVertexAttribArray(B),F[B]=0)}function A(U,F,B,I,k,G,q){q===!0?i.vertexAttribIPointer(U,F,B,k,G):i.vertexAttribPointer(U,F,B,I,k,G)}function v(U,F,B,I){S();let k=I.attributes,G=B.getAttributes(),q=F.defaultAttributeValues;for(let ne in G){let Y=G[ne];if(Y.location>=0){let j=k[ne];if(j===void 0&&(ne==="instanceMatrix"&&U.instanceMatrix&&(j=U.instanceMatrix),ne==="instanceColor"&&U.instanceColor&&(j=U.instanceColor)),j!==void 0){let ee=j.normalized,Me=j.itemSize,we=e.get(j);if(we===void 0)continue;let at=we.buffer,ze=we.type,je=we.bytesPerElement,J=ze===i.INT||ze===i.UNSIGNED_INT||j.gpuType===Kr;if(j.isInterleavedBufferAttribute){let Q=j.data,_e=Q.stride,Ue=j.offset;if(Q.isInstancedInterleavedBuffer){for(let me=0;me<Y.locationSize;me++)f(Y.location+me,Q.meshPerAttribute);U.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let me=0;me<Y.locationSize;me++)p(Y.location+me);i.bindBuffer(i.ARRAY_BUFFER,at);for(let me=0;me<Y.locationSize;me++)A(Y.location+me,Me/Y.locationSize,ze,ee,_e*je,(Ue+Me/Y.locationSize*me)*je,J)}else{if(j.isInstancedBufferAttribute){for(let Q=0;Q<Y.locationSize;Q++)f(Y.location+Q,j.meshPerAttribute);U.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let Q=0;Q<Y.locationSize;Q++)p(Y.location+Q);i.bindBuffer(i.ARRAY_BUFFER,at);for(let Q=0;Q<Y.locationSize;Q++)A(Y.location+Q,Me/Y.locationSize,ze,ee,Me*je,Me/Y.locationSize*Q*je,J)}}else if(q!==void 0){let ee=q[ne];if(ee!==void 0)switch(ee.length){case 2:i.vertexAttrib2fv(Y.location,ee);break;case 3:i.vertexAttrib3fv(Y.location,ee);break;case 4:i.vertexAttrib4fv(Y.location,ee);break;default:i.vertexAttrib1fv(Y.location,ee)}}}}M()}function b(){E();for(let U in n){let F=n[U];for(let B in F){let I=F[B];for(let k in I){let G=I[k];for(let q in G)u(G[q].object),delete G[q];delete I[k]}}delete n[U]}}function T(U){if(n[U.id]===void 0)return;let F=n[U.id];for(let B in F){let I=F[B];for(let k in I){let G=I[k];for(let q in G)u(G[q].object),delete G[q];delete I[k]}}delete n[U.id]}function R(U){for(let F in n){let B=n[F];for(let I in B){let k=B[I];if(k[U.id]===void 0)continue;let G=k[U.id];for(let q in G)u(G[q].object),delete G[q];delete k[U.id]}}}function _(U){for(let F in n){let B=n[F],I=U.isInstancedMesh===!0?U.id:0,k=B[I];if(k!==void 0){for(let G in k){let q=k[G];for(let ne in q)u(q[ne].object),delete q[ne];delete k[G]}delete B[I],Object.keys(B).length===0&&delete n[F]}}}function E(){C(),a=!0,r!==s&&(r=s,l(r.object))}function C(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:E,resetDefaultState:C,dispose:b,releaseStatesOfGeometry:T,releaseStatesOfObject:_,releaseStatesOfProgram:R,initAttributes:S,enableAttribute:p,disableUnusedAttributes:M}}function Jp(i,e,t){let n;function s(c){n=c}function r(c,l){i.drawArrays(n,c,l),t.update(l,n,1)}function a(c,l,u){u!==0&&(i.drawArraysInstanced(n,c,l,u),t.update(l,n,u))}function o(c,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,u);let h=0;for(let m=0;m<u;m++)h+=l[m];t.update(h,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function $p(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let R=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==Qt&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){let _=R===hn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Ht&&R!==cn&&!_&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function c(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",u=c(l);u!==l&&(Le("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);let d=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&Le("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),A=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=i.getParameter(i.MAX_SAMPLES),T=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:h,maxTextures:m,maxVertexTextures:x,maxTextureSize:S,maxCubemapSize:p,maxAttributes:f,maxVertexUniforms:M,maxVaryings:A,maxFragmentUniforms:v,maxSamples:b,samples:T}}function Kp(i){let e=this,t=null,n=0,s=!1,r=!1,a=new sn,o=new Fe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){let m=d.length!==0||h||n!==0||s;return s=h,n=d.length,m},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,m){let x=d.clippingPlanes,S=d.clipIntersection,p=d.clipShadows,f=i.get(d);if(!s||x===null||x.length===0||r&&!p)r?u(null):l();else{let M=r?0:n,A=M*4,v=f.clippingState||null;c.value=v,v=u(x,h,A,m);for(let b=0;b!==A;++b)v[b]=t[b];f.clippingState=v,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,h,m,x){let S=d!==null?d.length:0,p=null;if(S!==0){if(p=c.value,x!==!0||p===null){let f=m+S*4,M=h.matrixWorldInverse;o.getNormalMatrix(M),(p===null||p.length<f)&&(p=new Float32Array(f));for(let A=0,v=m;A!==S;++A,v+=4)a.copy(d[A]).applyMatrix4(M,o),a.normal.toArray(p,v),p[v+3]=a.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=S,e.numIntersection=0,p}}var Zi=4,Qp=6,jp=20,em=256,zs=new Vi,Kc=new Pe,nl=null,il=0,sl=0,rl=!1,tm=new P,fi=new P,Ba=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=tm}=r;nl=this._renderer.getRenderTarget(),il=this._renderer.getActiveCubeFace(),sl=this._renderer.getActiveMipmapLevel(),rl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=eh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=jc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(nl,il,sl),this._renderer.xr.enabled=rl,e.scissorTest=!1,Yi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===$n||e.mapping===ui?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),nl=this._renderer.getRenderTarget(),il=this._renderer.getActiveCubeFace(),sl=this._renderer.getActiveMipmapLevel(),rl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ct,minFilter:Ct,generateMipmaps:!1,type:hn,format:Qt,colorSpace:ds,depthBuffer:!1},s=Qc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Qc(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=nm(r)),this._blurMaterial=sm(r,e,t),this._ggxMaterial=im(r,e,t)}return s}_compileMaterial(e){let t=new rt(new At,e);this._renderer.compile(t,zs)}_sceneToCubeUV(e,t,n,s,r){let c=new Mt(90,1,t,n),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,m=d.toneMapping;d.getClearColor(Kc),d.toneMapping=Yt,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new rt(new Wn,new an({name:"PMREM.Background",side:zt,depthWrite:!1,depthTest:!1})));let S=this._backgroundBox,p=S.material,f=!1,M=e.background;M?M.isColor&&(p.color.copy(M),e.background=null,f=!0):(p.color.copy(Kc),f=!0);for(let A=0;A<6;A++){let v=A%3;v===0?(c.up.set(0,l[A],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+u[A],r.y,r.z)):v===1?(c.up.set(0,0,l[A]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+u[A],r.z)):(c.up.set(0,l[A],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+u[A]));let b=this._cubeSize;Yi(s,v*b,A>2?b:0,b,b),d.setRenderTarget(s),f&&d.render(S,c),d.render(e,c)}d.toneMapping=m,d.autoClear=h,e.background=M}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===$n||e.mapping===ui;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=eh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=jc());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let c=this._cubeSize;Yi(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,zs)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let c=a.uniforms,l=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(l*l-u*u),h=l*1.25,m=d*h,{_lodMax:x}=this,S=this._sizeLods[n],p=3*S*(n>x-Zi?n-x+Zi:0),f=4*(this._cubeSize-S);c.envMap.value=e.texture,c.roughness.value=m,c.mipInt.value=x-t,Yi(r,p,f,3*S,2*S),s.setRenderTarget(r),s.render(o,zs),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=x-n,Yi(e,p,f,3*S,2*S),s.setRenderTarget(e),s.render(o,zs)}_blur(e,t,n,s){let r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,s,r){let a=this._renderer,o=this._blurMaterial,c=this._lodMeshes[s];c.material=o;let l=o.uniforms;l.envMap.value=e.texture,l.sigma.value=r,l.mipInt.value=this._lodMax-n;let u=this._sizeLods[s],d=3*u*(s>this._lodMax-Zi?s-this._lodMax+Zi:0),h=4*(this._cubeSize-u);Yi(t,d,h,3*u,2*u),a.setRenderTarget(t),a.render(c,zs)}};function nm(i){let e=[],t=[],n=i,s=i-Zi+1+Qp;for(let r=0;r<s;r++){let a=Math.pow(2,n);e.push(a);let o=1/(a-2),c=-o,l=1+o,u=[c,c,l,c,l,l,c,c,l,l,c,l],d=6,h=6,m=3,x=new Float32Array(m*h*d),S=new Float32Array(m*h*d);for(let f=0;f<d;f++){let M=f%3*2/3-1,A=f>2?0:-1,v=[M,A,0,M+2/3,A,0,M+2/3,A+1,0,M,A,0,M+2/3,A+1,0,M,A+1,0];x.set(v,m*h*f);for(let b=0;b<h;b++){let T=u[b*2]*2-1,R=u[b*2+1]*2-1;f===0?fi.set(1,R,T):f===1?fi.set(-T,1,-R):f===2?fi.set(-T,R,1):f===3?fi.set(-1,R,-T):f===4?fi.set(-T,-1,R):fi.set(T,R,-1),fi.toArray(S,(f*h+b)*m)}}let p=new At;p.setAttribute("position",new Tt(x,m)),p.setAttribute("outputDirection",new Tt(S,m)),t.push(new rt(p,null)),n>Zi&&n--}return{lodMeshes:t,sizeLods:e}}function Qc(i,e,t){let n=new Vt(i,e,t);return n.texture.mapping=Is,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Yi(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function im(i,e,t){return new Bt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:em,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Va(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:yn,depthTest:!1,depthWrite:!1})}function sm(i,e,t){return new Bt({name:"SphericalGaussianBlur",defines:{SAMPLES:jp,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Va(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:yn,depthTest:!1,depthWrite:!1})}function jc(){return new Bt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Va(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:yn,depthTest:!1,depthWrite:!1})}function eh(){return new Bt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Va(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:yn,depthTest:!1,depthWrite:!1})}function Va(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var za=class extends Vt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new ys(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Wn(5,5,5),r=new Bt({name:"CubemapFromEquirect",uniforms:di(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:zt,blending:yn});r.uniforms.tEquirect.value=t;let a=new rt(s,r),o=t.minFilter;return t.minFilter===Kn&&(t.minFilter=Ct),new qr(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}};function rm(i){let e=new WeakMap,t=new WeakMap,n=null;function s(h,m=!1){return h==null?null:m?a(h):r(h)}function r(h){if(h&&h.isTexture){let m=h.mapping;if(m===Zr||m===Jr)if(e.has(h)){let x=e.get(h).texture;return o(x,h.mapping)}else{let x=h.image;if(x&&x.height>0){let S=new za(x.height);return S.fromEquirectangularTexture(i,h),e.set(h,S),h.addEventListener("dispose",l),o(S.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){let m=h.mapping,x=m===Zr||m===Jr,S=m===$n||m===ui;if(x||S){let p=t.get(h),f=p!==void 0?p.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==f)return n===null&&(n=new Ba(i)),p=x?n.fromEquirectangular(h,p):n.fromCubemap(h,p),p.texture.pmremVersion=h.pmremVersion,t.set(h,p),p.texture;if(p!==void 0)return p.texture;{let M=h.image;return x&&M&&M.height>0||S&&M&&c(M)?(n===null&&(n=new Ba(i)),p=x?n.fromEquirectangular(h):n.fromCubemap(h),p.texture.pmremVersion=h.pmremVersion,t.set(h,p),h.addEventListener("dispose",u),p.texture):null}}}return h}function o(h,m){return m===Zr?h.mapping=$n:m===Jr&&(h.mapping=ui),h}function c(h){let m=0,x=6;for(let S=0;S<x;S++)h[S]!==void 0&&m++;return m===x}function l(h){let m=h.target;m.removeEventListener("dispose",l);let x=e.get(m);x!==void 0&&(e.delete(m),x.dispose())}function u(h){let m=h.target;m.removeEventListener("dispose",u);let x=t.get(m);x!==void 0&&(t.delete(m),x.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function am(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&ri("WebGLRenderer: "+n+" extension not supported."),s}}}function om(i,e,t,n){let s={},r=new WeakMap;function a(d){let h=d.target;h.index!==null&&e.remove(h.index);for(let x in h.attributes)e.remove(h.attributes[x]);h.removeEventListener("dispose",a),delete s[h.id];let m=r.get(h);m&&(e.remove(m),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(d,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,t.memory.geometries++),h}function c(d){let h=d.attributes;for(let m in h)e.update(h[m],i.ARRAY_BUFFER)}function l(d){let h=[],m=d.index,x=d.attributes.position,S=0;if(x===void 0)return;if(m!==null){let M=m.array;S=m.version;for(let A=0,v=M.length;A<v;A+=3){let b=M[A+0],T=M[A+1],R=M[A+2];h.push(b,T,T,R,R,b)}}else{let M=x.array;S=x.version;for(let A=0,v=M.length/3-1;A<v;A+=3){let b=A+0,T=A+1,R=A+2;h.push(b,T,T,R,R,b)}}let p=new(x.count>=65535?xs:_s)(h,1);p.version=S;let f=r.get(d);f&&e.remove(f),r.set(d,p)}function u(d){let h=r.get(d);if(h){let m=d.index;m!==null&&h.version<m.version&&l(d)}else l(d);return r.get(d)}return{get:o,update:c,getWireframeAttribute:u}}function lm(i,e,t){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,h){i.drawElements(n,h,r,d*a),t.update(h,n,1)}function l(d,h,m){m!==0&&(i.drawElementsInstanced(n,h,r,d*a,m),t.update(h,n,m))}function u(d,h,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,d,0,m);let S=0;for(let p=0;p<m;p++)S+=h[p];t.update(S,n,1)}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function cm(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:De("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function hm(i,e,t){let n=new WeakMap,s=new pt;function r(a,o,c){let l=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0,h=n.get(o);if(h===void 0||h.count!==d){let E=function(){R.dispose(),n.delete(o),o.removeEventListener("dispose",E)};h!==void 0&&h.texture.dispose();let m=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,S=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],M=o.morphAttributes.color||[],A=0;m===!0&&(A=1),x===!0&&(A=2),S===!0&&(A=3);let v=o.attributes.position.count*A,b=1;v>e.maxTextureSize&&(b=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let T=new Float32Array(v*b*4*d),R=new ms(T,v,b,d);R.type=cn,R.needsUpdate=!0;let _=A*4;for(let C=0;C<d;C++){let U=p[C],F=f[C],B=M[C],I=v*b*4*C;for(let k=0;k<U.count;k++){let G=k*_;m===!0&&(s.fromBufferAttribute(U,k),T[I+G+0]=s.x,T[I+G+1]=s.y,T[I+G+2]=s.z,T[I+G+3]=0),x===!0&&(s.fromBufferAttribute(F,k),T[I+G+4]=s.x,T[I+G+5]=s.y,T[I+G+6]=s.z,T[I+G+7]=0),S===!0&&(s.fromBufferAttribute(B,k),T[I+G+8]=s.x,T[I+G+9]=s.y,T[I+G+10]=s.z,T[I+G+11]=B.itemSize===4?s.w:1)}}h={count:d,texture:R,size:new ke(v,b)},n.set(o,h),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let m=0;for(let S=0;S<l.length;S++)m+=l[S];let x=o.morphTargetsRelative?1:1-m;c.getUniforms().setValue(i,"morphTargetBaseInfluence",x),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function um(i,e,t,n,s){let r=new WeakMap;function a(l){let u=s.render.frame,d=l.geometry,h=e.get(l,d);if(r.get(h)!==u&&(e.update(h),r.set(h,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==u&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,u))),l.isSkinnedMesh){let m=l.skeleton;r.get(m)!==u&&(m.update(),r.set(m,u))}return h}function o(){r=new WeakMap}function c(l){let u=l.target;u.removeEventListener("dispose",c),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}var dm={[No]:"LINEAR_TONE_MAPPING",[Do]:"REINHARD_TONE_MAPPING",[Uo]:"CINEON_TONE_MAPPING",[Fo]:"ACES_FILMIC_TONE_MAPPING",[Bo]:"AGX_TONE_MAPPING",[zo]:"NEUTRAL_TONE_MAPPING",[Oo]:"CUSTOM_TONE_MAPPING"};function fm(i,e,t,n,s,r){let a=new Vt(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,c=null,l=new At;l.setAttribute("position",new st([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new st([0,2,0,0,2,0],2));let u=new Nr({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new rt(l,u),h=new Vi(-1,1,1,-1,0,1),m=null,x=null,S=!1,p,f=null,M=[],A=!1;this.setSize=function(v,b){a.setSize(v,b),o!==null&&o.setSize(v,b),c!==null&&c.setSize(v,b);for(let T=0;T<M.length;T++){let R=M[T];R.setSize&&R.setSize(v,b)}},this.setEffects=function(v){M=v,A=M.length>0&&M[0].isRenderPass===!0;let b=a.width,T=a.height;M.length>0&&o===null&&(o=new Vt(b,T,{type:hn,depthBuffer:!1,stencilBuffer:!1}),c=new Vt(b,T,{type:hn,depthBuffer:!1,stencilBuffer:!1}));for(let R=0;R<M.length;R++){let _=M[R];_.setSize&&_.setSize(b,T)}},this.begin=function(v,b){if(S||v.toneMapping===Yt&&M.length===0)return!1;if(f=b,b!==null){let T=b.width,R=b.height;(a.width!==T||a.height!==R)&&this.setSize(T,R)}return A===!1&&v.setRenderTarget(a),p=v.toneMapping,v.toneMapping=Yt,!0},this.hasRenderPass=function(){return A},this.end=function(v,b){v.toneMapping=p,S=!0;let T=a,R=o;for(let _=0;_<M.length;_++){let E=M[_];E.enabled!==!1&&(E.render(v,R,T,b),E.needsSwap!==!1&&(T=R,R=R===o?c:o))}if(m!==v.outputColorSpace||x!==v.toneMapping){m=v.outputColorSpace,x=v.toneMapping,u.defines={},$e.getTransfer(m)===it&&(u.defines.SRGB_TRANSFER="");let _=dm[x];_&&(u.defines[_]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=T.texture,v.setRenderTarget(f),v.render(d,h),f=null,S=!1},this.isCompositing=function(){return S},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var vh=new Ot,ll=new Gn(1,1),Mh=new ms,Sh=new Ar,bh=new ys,th=[],nh=[],ih=new Float32Array(16),sh=new Float32Array(9),rh=new Float32Array(4);function Ki(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=th[s];if(r===void 0&&(r=new Float32Array(s),th[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function St(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function bt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Ha(i,e){let t=nh[e];t===void 0&&(t=new Int32Array(e),nh[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function pm(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function mm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;i.uniform2fv(this.addr,e),bt(t,e)}}function gm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(St(t,e))return;i.uniform3fv(this.addr,e),bt(t,e)}}function _m(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;i.uniform4fv(this.addr,e),bt(t,e)}}function xm(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(St(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),bt(t,e)}else{if(St(t,n))return;rh.set(n),i.uniformMatrix2fv(this.addr,!1,rh),bt(t,n)}}function ym(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(St(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),bt(t,e)}else{if(St(t,n))return;sh.set(n),i.uniformMatrix3fv(this.addr,!1,sh),bt(t,n)}}function vm(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(St(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),bt(t,e)}else{if(St(t,n))return;ih.set(n),i.uniformMatrix4fv(this.addr,!1,ih),bt(t,n)}}function Mm(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Sm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;i.uniform2iv(this.addr,e),bt(t,e)}}function bm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(St(t,e))return;i.uniform3iv(this.addr,e),bt(t,e)}}function Em(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;i.uniform4iv(this.addr,e),bt(t,e)}}function Tm(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function wm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;i.uniform2uiv(this.addr,e),bt(t,e)}}function Am(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(St(t,e))return;i.uniform3uiv(this.addr,e),bt(t,e)}}function Rm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;i.uniform4uiv(this.addr,e),bt(t,e)}}function Cm(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(ll.compareFunction=t.isReversedDepthBuffer()?Ua:Da,r=ll):r=vh,t.setTexture2D(e||r,s)}function Pm(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Sh,s)}function Im(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||bh,s)}function Lm(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Mh,s)}function Nm(i){switch(i){case 5126:return pm;case 35664:return mm;case 35665:return gm;case 35666:return _m;case 35674:return xm;case 35675:return ym;case 35676:return vm;case 5124:case 35670:return Mm;case 35667:case 35671:return Sm;case 35668:case 35672:return bm;case 35669:case 35673:return Em;case 5125:return Tm;case 36294:return wm;case 36295:return Am;case 36296:return Rm;case 35678:case 36198:case 36298:case 36306:case 35682:return Cm;case 35679:case 36299:case 36307:return Pm;case 35680:case 36300:case 36308:case 36293:return Im;case 36289:case 36303:case 36311:case 36292:return Lm}}function Dm(i,e){i.uniform1fv(this.addr,e)}function Um(i,e){let t=Ki(e,this.size,2);i.uniform2fv(this.addr,t)}function Fm(i,e){let t=Ki(e,this.size,3);i.uniform3fv(this.addr,t)}function Om(i,e){let t=Ki(e,this.size,4);i.uniform4fv(this.addr,t)}function Bm(i,e){let t=Ki(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function zm(i,e){let t=Ki(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Vm(i,e){let t=Ki(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Hm(i,e){i.uniform1iv(this.addr,e)}function km(i,e){i.uniform2iv(this.addr,e)}function Gm(i,e){i.uniform3iv(this.addr,e)}function Wm(i,e){i.uniform4iv(this.addr,e)}function Xm(i,e){i.uniform1uiv(this.addr,e)}function qm(i,e){i.uniform2uiv(this.addr,e)}function Ym(i,e){i.uniform3uiv(this.addr,e)}function Zm(i,e){i.uniform4uiv(this.addr,e)}function Jm(i,e,t){let n=this.cache,s=e.length,r=Ha(t,s);St(n,r)||(i.uniform1iv(this.addr,r),bt(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=ll:a=vh;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function $m(i,e,t){let n=this.cache,s=e.length,r=Ha(t,s);St(n,r)||(i.uniform1iv(this.addr,r),bt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Sh,r[a])}function Km(i,e,t){let n=this.cache,s=e.length,r=Ha(t,s);St(n,r)||(i.uniform1iv(this.addr,r),bt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||bh,r[a])}function Qm(i,e,t){let n=this.cache,s=e.length,r=Ha(t,s);St(n,r)||(i.uniform1iv(this.addr,r),bt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Mh,r[a])}function jm(i){switch(i){case 5126:return Dm;case 35664:return Um;case 35665:return Fm;case 35666:return Om;case 35674:return Bm;case 35675:return zm;case 35676:return Vm;case 5124:case 35670:return Hm;case 35667:case 35671:return km;case 35668:case 35672:return Gm;case 35669:case 35673:return Wm;case 5125:return Xm;case 36294:return qm;case 36295:return Ym;case 36296:return Zm;case 35678:case 36198:case 36298:case 36306:case 35682:return Jm;case 35679:case 36299:case 36307:return $m;case 35680:case 36300:case 36308:case 36293:return Km;case 36289:case 36303:case 36311:case 36292:return Qm}}var cl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Nm(t.type)}},hl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=jm(t.type)}},ul=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},al=/(\w+)(\])?(\[|\.)?/g;function ah(i,e){i.seq.push(e),i.map[e.id]=e}function eg(i,e,t){let n=i.name,s=n.length;for(al.lastIndex=0;;){let r=al.exec(n),a=al.lastIndex,o=r[1],c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){ah(t,l===void 0?new cl(o,i,e):new hl(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new ul(o),ah(t,d)),t=d}}}var Ji=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);eg(o,c,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function oh(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var tg=37297,ng=0;function ig(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var lh=new Fe;function sg(i){$e._getMatrix(lh,$e.workingColorSpace,i);let e=`mat3( ${lh.elements.map(t=>t.toFixed(4))} )`;switch($e.getTransfer(i)){case fs:return[e,"LinearTransferOETF"];case it:return[e,"sRGBTransferOETF"];default:return Le("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function ch(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+ig(i.getShaderSource(e),o)}else return r}function rg(i,e){let t=sg(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var ag={[No]:"Linear",[Do]:"Reinhard",[Uo]:"Cineon",[Fo]:"ACESFilmic",[Bo]:"AgX",[zo]:"Neutral",[Oo]:"Custom"};function og(i,e){let t=ag[e];return t===void 0?(Le("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Oa=new P;function lg(){$e.getLuminanceCoefficients(Oa);let i=Oa.x.toFixed(4),e=Oa.y.toFixed(4),t=Oa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function cg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Hs).join(`
`)}function hg(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function ug(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Hs(i){return i!==""}function hh(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function uh(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var dg=/^[ \t]*#include +<([\w\d./]+)>/gm;function dl(i){return i.replace(dg,pg)}var fg=new Map;function pg(i,e){let t=Ge[e];if(t===void 0){let n=fg.get(e);if(n!==void 0)t=Ge[n],Le('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return dl(t)}var mg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function dh(i){return i.replace(mg,gg)}function gg(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function fh(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var _g={[Ps]:"SHADOWMAP_TYPE_PCF",[Hi]:"SHADOWMAP_TYPE_VSM"};function xg(i){return _g[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var yg={[$n]:"ENVMAP_TYPE_CUBE",[ui]:"ENVMAP_TYPE_CUBE",[Is]:"ENVMAP_TYPE_CUBE_UV"};function vg(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":yg[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var Mg={[ui]:"ENVMAP_MODE_REFRACTION"};function Sg(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Mg[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var bg={[Lo]:"ENVMAP_BLENDING_MULTIPLY",[Pc]:"ENVMAP_BLENDING_MIX",[Ic]:"ENVMAP_BLENDING_ADD"};function Eg(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":bg[i.combine]||"ENVMAP_BLENDING_NONE"}function Tg(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function wg(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,c=xg(t),l=vg(t),u=Sg(t),d=Eg(t),h=Tg(t),m=cg(t),x=hg(r),S=s.createProgram(),p,f,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Hs).join(`
`),p.length>0&&(p+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Hs).join(`
`),f.length>0&&(f+=`
`)):(p=[fh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Hs).join(`
`),f=[fh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Yt?"#define TONE_MAPPING":"",t.toneMapping!==Yt?Ge.tonemapping_pars_fragment:"",t.toneMapping!==Yt?og("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ge.colorspace_pars_fragment,rg("linearToOutputTexel",t.outputColorSpace),lg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Hs).join(`
`)),a=dl(a),a=hh(a,t),a=uh(a,t),o=dl(o),o=hh(o,t),o=uh(o,t),a=dh(a),o=dh(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,f=["#define varying in",t.glslVersion===Jo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Jo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let A=M+p+a,v=M+f+o,b=oh(s,s.VERTEX_SHADER,A),T=oh(s,s.FRAGMENT_SHADER,v);s.attachShader(S,b),s.attachShader(S,T),t.index0AttributeName!==void 0?s.bindAttribLocation(S,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(S,0,"position"),s.linkProgram(S);function R(U){if(i.debug.checkShaderErrors){let F=s.getProgramInfoLog(S)||"",B=s.getShaderInfoLog(b)||"",I=s.getShaderInfoLog(T)||"",k=F.trim(),G=B.trim(),q=I.trim(),ne=!0,Y=!0;if(s.getProgramParameter(S,s.LINK_STATUS)===!1)if(ne=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,S,b,T);else{let j=ch(s,b,"vertex"),ee=ch(s,T,"fragment");De("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(S,s.VALIDATE_STATUS)+`

Material Name: `+U.name+`
Material Type: `+U.type+`

Program Info Log: `+k+`
`+j+`
`+ee)}else k!==""?Le("WebGLProgram: Program Info Log:",k):(G===""||q==="")&&(Y=!1);Y&&(U.diagnostics={runnable:ne,programLog:k,vertexShader:{log:G,prefix:p},fragmentShader:{log:q,prefix:f}})}s.deleteShader(b),s.deleteShader(T),_=new Ji(s,S),E=ug(s,S)}let _;this.getUniforms=function(){return _===void 0&&R(this),_};let E;this.getAttributes=function(){return E===void 0&&R(this),E};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(S,tg)),C},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(S),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=ng++,this.cacheKey=e,this.usedTimes=1,this.program=S,this.vertexShader=b,this.fragmentShader=T,this}var Ag=0,fl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new pl(e),t.set(e,n)),n}},pl=class{constructor(e){this.id=Ag++,this.code=e,this.usedTimes=0}};function Rg(i){return i===jn||i===Os||i===Bs}function Cg(i,e,t,n,s,r){let a=new gs,o=new fl,c=new Set,l=[],u=new Map,d=n.logarithmicDepthBuffer,h=n.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(_){return c.add(_),_===0?"uv":`uv${_}`}function S(_,E,C,U,F,B){let I=U.fog,k=F.geometry,G=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?U.environment:null,q=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,ne=e.get(_.envMap||G,q),Y=ne&&ne.mapping===Is?ne.image.height:null,j=m[_.type];_.precision!==null&&(h=n.getMaxPrecision(_.precision),h!==_.precision&&Le("WebGLProgram.getParameters:",_.precision,"not supported, using",h,"instead."));let ee=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,Me=ee!==void 0?ee.length:0,we=0;k.morphAttributes.position!==void 0&&(we=1),k.morphAttributes.normal!==void 0&&(we=2),k.morphAttributes.color!==void 0&&(we=3);let at,ze,je,J;if(j){let ht=Mn[j];at=ht.vertexShader,ze=ht.fragmentShader}else{at=_.vertexShader,ze=_.fragmentShader;let ht=o.getVertexShaderStage(_),tt=o.getFragmentShaderStage(_);o.update(_,ht,tt),je=ht.id,J=tt.id}let Q=i.getRenderTarget(),_e=i.state.buffers.depth.getReversed(),Ue=F.isInstancedMesh===!0,me=F.isBatchedMesh===!0,Ve=!!_.map,gt=!!_.matcap,We=!!ne,qe=!!_.aoMap,fe=!!_.lightMap,Re=!!_.bumpMap&&_.wireframe===!1,Be=!!_.normalMap,Ye=!!_.displacementMap,Qe=!!_.emissiveMap,Xe=!!_.metalnessMap,ct=!!_.roughnessMap,D=_.anisotropy>0,vt=_.clearcoat>0,Je=_.dispersion>0,w=_.retroreflectivity>0,g=_.iridescence>0,O=_.sheen>0,H=_.transmission>0,X=D&&!!_.anisotropyMap,ie=vt&&!!_.clearcoatMap,se=vt&&!!_.clearcoatNormalMap,Z=vt&&!!_.clearcoatRoughnessMap,$=g&&!!_.iridescenceMap,re=g&&!!_.iridescenceThicknessMap,Se=O&&!!_.sheenColorMap,ae=O&&!!_.sheenRoughnessMap,oe=!!_.specularMap,Ae=!!_.specularColorMap,Ie=!!_.specularIntensityMap,Oe=H&&!!_.transmissionMap,N=H&&!!_.thicknessMap,le=!!_.gradientMap,K=!!_.alphaMap,ce=_.alphaTest>0,pe=!!_.alphaHash,te=!!_.extensions,Ce=Yt;_.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(Ce=i.toneMapping);let be={shaderID:j,shaderType:_.type,shaderName:_.name,vertexShader:at,fragmentShader:ze,defines:_.defines,customVertexShaderID:je,customFragmentShaderID:J,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:h,batching:me,batchingColor:me&&F._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&F.instanceColor!==null,instancingMorph:Ue&&F.morphTexture!==null,outputColorSpace:Q===null?i.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:$e.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Ve,matcap:gt,envMap:We,envMapMode:We&&ne.mapping,envMapCubeUVHeight:Y,aoMap:qe,lightMap:fe,bumpMap:Re,normalMap:Be,displacementMap:Ye,emissiveMap:Qe,normalMapObjectSpace:Be&&_.normalMapType===Dc,normalMapTangentSpace:Be&&_.normalMapType===Na,packedNormalMap:Be&&_.normalMapType===Na&&Rg(_.normalMap.format),metalnessMap:Xe,roughnessMap:ct,anisotropy:D,anisotropyMap:X,clearcoat:vt,clearcoatMap:ie,clearcoatNormalMap:se,clearcoatRoughnessMap:Z,dispersion:Je,retroreflection:w,iridescence:g,iridescenceMap:$,iridescenceThicknessMap:re,sheen:O,sheenColorMap:Se,sheenRoughnessMap:ae,specularMap:oe,specularColorMap:Ae,specularIntensityMap:Ie,transmission:H,transmissionMap:Oe,thicknessMap:N,gradientMap:le,opaque:_.transparent===!1&&_.blending===ki&&_.alphaToCoverage===!1,alphaMap:K,alphaTest:ce,alphaHash:pe,combine:_.combine,mapUv:Ve&&x(_.map.channel),aoMapUv:qe&&x(_.aoMap.channel),lightMapUv:fe&&x(_.lightMap.channel),bumpMapUv:Re&&x(_.bumpMap.channel),normalMapUv:Be&&x(_.normalMap.channel),displacementMapUv:Ye&&x(_.displacementMap.channel),emissiveMapUv:Qe&&x(_.emissiveMap.channel),metalnessMapUv:Xe&&x(_.metalnessMap.channel),roughnessMapUv:ct&&x(_.roughnessMap.channel),anisotropyMapUv:X&&x(_.anisotropyMap.channel),clearcoatMapUv:ie&&x(_.clearcoatMap.channel),clearcoatNormalMapUv:se&&x(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Z&&x(_.clearcoatRoughnessMap.channel),iridescenceMapUv:$&&x(_.iridescenceMap.channel),iridescenceThicknessMapUv:re&&x(_.iridescenceThicknessMap.channel),sheenColorMapUv:Se&&x(_.sheenColorMap.channel),sheenRoughnessMapUv:ae&&x(_.sheenRoughnessMap.channel),specularMapUv:oe&&x(_.specularMap.channel),specularColorMapUv:Ae&&x(_.specularColorMap.channel),specularIntensityMapUv:Ie&&x(_.specularIntensityMap.channel),transmissionMapUv:Oe&&x(_.transmissionMap.channel),thicknessMapUv:N&&x(_.thicknessMap.channel),alphaMapUv:K&&x(_.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(Be||D),vertexNormals:!!k.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!k.attributes.uv&&(Ve||K),fog:!!I,useFog:_.fog===!0,fogExp2:!!I&&I.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||k.attributes.normal===void 0&&Be===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:_e,skinning:F.isSkinnedMesh===!0,hasPositionAttribute:k.attributes.position!==void 0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:Me,morphTextureStride:we,numSunLights:E.sun.length,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numSunLightShadows:E.sunShadowMap.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:B.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ce,decodeVideoTexture:Ve&&_.map.isVideoTexture===!0&&$e.getTransfer(_.map.colorSpace)===it,decodeVideoTextureEmissive:Qe&&_.emissiveMap.isVideoTexture===!0&&$e.getTransfer(_.emissiveMap.colorSpace)===it,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Kt,flipSided:_.side===zt,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:te&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(te&&_.extensions.multiDraw===!0||me)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return be.vertexUv1s=c.has(1),be.vertexUv2s=c.has(2),be.vertexUv3s=c.has(3),c.clear(),be}function p(_){let E=[];if(_.shaderID?E.push(_.shaderID):(E.push(_.customVertexShaderID),E.push(_.customFragmentShaderID)),_.defines!==void 0)for(let C in _.defines)E.push(C),E.push(_.defines[C]);return _.isRawShaderMaterial===!1&&(f(E,_),M(E,_),E.push(i.outputColorSpace)),E.push(_.customProgramCacheKey),E.join()}function f(_,E){_.push(E.precision),_.push(E.outputColorSpace),_.push(E.envMapMode),_.push(E.envMapCubeUVHeight),_.push(E.mapUv),_.push(E.alphaMapUv),_.push(E.lightMapUv),_.push(E.aoMapUv),_.push(E.bumpMapUv),_.push(E.normalMapUv),_.push(E.displacementMapUv),_.push(E.emissiveMapUv),_.push(E.metalnessMapUv),_.push(E.roughnessMapUv),_.push(E.anisotropyMapUv),_.push(E.clearcoatMapUv),_.push(E.clearcoatNormalMapUv),_.push(E.clearcoatRoughnessMapUv),_.push(E.iridescenceMapUv),_.push(E.iridescenceThicknessMapUv),_.push(E.sheenColorMapUv),_.push(E.sheenRoughnessMapUv),_.push(E.specularMapUv),_.push(E.specularColorMapUv),_.push(E.specularIntensityMapUv),_.push(E.transmissionMapUv),_.push(E.thicknessMapUv),_.push(E.combine),_.push(E.fogExp2),_.push(E.sizeAttenuation),_.push(E.morphTargetsCount),_.push(E.morphAttributeCount),_.push(E.numSunLights),_.push(E.numDirLights),_.push(E.numPointLights),_.push(E.numSpotLights),_.push(E.numSpotLightMaps),_.push(E.numHemiLights),_.push(E.numRectAreaLights),_.push(E.numSunLightShadows),_.push(E.numDirLightShadows),_.push(E.numPointLightShadows),_.push(E.numSpotLightShadows),_.push(E.numSpotLightShadowsWithMaps),_.push(E.numLightProbes),_.push(E.shadowMapType),_.push(E.toneMapping),_.push(E.numClippingPlanes),_.push(E.numClipIntersection),_.push(E.depthPacking)}function M(_,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.retroreflection&&a.enable(24),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),E.packedNormalMap&&a.enable(22),E.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),E.numLightProbeGrids>0&&a.enable(22),E.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function A(_){let E=m[_.type],C;if(E){let U=Mn[E];C=Zc.clone(U.uniforms)}else C=_.uniforms;return C}function v(_,E){let C=u.get(E);return C!==void 0?++C.usedTimes:(C=new wg(i,E,_,s),l.push(C),u.set(E,C)),C}function b(_){if(--_.usedTimes===0){let E=l.indexOf(_);l[E]=l[l.length-1],l.pop(),u.delete(_.cacheKey),_.destroy()}}function T(_){o.remove(_)}function R(){o.dispose()}return{getParameters:S,getProgramCacheKey:p,getUniforms:A,acquireProgram:v,releaseProgram:b,releaseShaderCache:T,programs:l,dispose:R}}function Pg(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Ig(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function ph(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function mh(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(h){let m=0;return h.isInstancedMesh&&(m+=2),h.isSkinnedMesh&&(m+=1),m}function o(h,m,x,S,p,f){let M=i[e];return M===void 0?(M={id:h.id,object:h,geometry:m,material:x,materialVariant:a(h),groupOrder:S,renderOrder:h.renderOrder,z:p,group:f},i[e]=M):(M.id=h.id,M.object=h,M.geometry=m,M.material=x,M.materialVariant=a(h),M.groupOrder=S,M.renderOrder=h.renderOrder,M.z=p,M.group=f),e++,M}function c(h,m,x,S,p,f,M){M.reversedDepth===!0&&(p=-p);let A=o(h,m,x,S,p,f);x.transmission>0?n.push(A):x.transparent===!0?s.push(A):t.push(A)}function l(h,m,x,S,p,f){let M=o(h,m,x,S,p,f);x.transmission>0?n.unshift(M):x.transparent===!0?s.unshift(M):t.unshift(M)}function u(h,m){t.length>1&&t.sort(h||Ig),n.length>1&&n.sort(m||ph),s.length>1&&s.sort(m||ph)}function d(){for(let h=e,m=i.length;h<m;h++){let x=i[h];if(x.id===null)break;x.id=null,x.object=null,x.geometry=null,x.material=null,x.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:c,unshift:l,finish:d,sort:u}}function Lg(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new mh,i.set(n,[a])):s>=r.length?(a=new mh,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Ng(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new P,color:new Pe};break;case"SpotLight":t={position:new P,direction:new P,color:new Pe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new Pe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new Pe,groundColor:new Pe};break;case"RectAreaLight":t={color:new Pe,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function Dg(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ke};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ke};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ke,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var Ug=0;function Fg(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Og(i){let e=new Ng,t=Dg(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new P);let s=new P,r=new mt,a=new mt;function o(l){let u=0,d=0,h=0;for(let F=0;F<9;F++)n.probe[F].set(0,0,0);let m=0,x=0,S=0,p=0,f=0,M=0,A=0,v=0,b=0,T=0,R=0,_=0,E=0,C=0;l.sort(Fg);for(let F=0,B=l.length;F<B;F++){let I=l[F],k=I.color,G=I.intensity,q=I.distance,ne=null;if(I.shadow&&I.shadow.map&&(I.shadow.map.texture.format===jn?ne=I.shadow.map.texture:ne=I.shadow.map.depthTexture||I.shadow.map.texture),I.isAmbientLight)u+=k.r*G,d+=k.g*G,h+=k.b*G;else if(I.isLightProbe){for(let Y=0;Y<9;Y++)n.probe[Y].addScaledVector(I.sh.coefficients[Y],G);C++}else if(I.isSunLight){let Y=e.get(I);if(Y.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let j=I.shadow,ee=t.get(I);ee.shadowIntensity=j.intensity,ee.shadowBias=j.bias,ee.shadowNormalBias=j.normalBias,ee.shadowRadius=j.radius,ee.shadowMapSize.copy(j.mapSize).multiply(j.getFrameExtents()),n.sunShadow[x]=ee,n.sunShadowMap[x]=ne;let Me=j.getViewportCount();for(let we=0;we<Me;we++)n.sunShadowMatrix[S+we]=j.getMatrix(we),n.sunShadowCascade[S+we]=j._cascadeData[we];S+=Me,x++}n.sun[m]=Y,m++}else if(I.isDirectionalLight){let Y=e.get(I);if(Y.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let j=I.shadow,ee=t.get(I);ee.shadowIntensity=j.intensity,ee.shadowBias=j.bias,ee.shadowNormalBias=j.normalBias,ee.shadowRadius=j.radius,ee.shadowMapSize=j.mapSize,n.directionalShadow[p]=ee,n.directionalShadowMap[p]=ne,n.directionalShadowMatrix[p]=I.shadow.matrix,b++}n.directional[p]=Y,p++}else if(I.isSpotLight){let Y=e.get(I);Y.position.setFromMatrixPosition(I.matrixWorld),Y.color.copy(k).multiplyScalar(G),Y.distance=q,Y.coneCos=Math.cos(I.angle),Y.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),Y.decay=I.decay,n.spot[M]=Y;let j=I.shadow;if(I.map&&(n.spotLightMap[_]=I.map,_++,j.updateMatrices(I),I.castShadow&&E++),n.spotLightMatrix[M]=j.matrix,I.castShadow){let ee=t.get(I);ee.shadowIntensity=j.intensity,ee.shadowBias=j.bias,ee.shadowNormalBias=j.normalBias,ee.shadowRadius=j.radius,ee.shadowMapSize=j.mapSize,n.spotShadow[M]=ee,n.spotShadowMap[M]=ne,R++}M++}else if(I.isRectAreaLight){let Y=e.get(I);Y.color.copy(k).multiplyScalar(G),Y.halfWidth.set(I.width*.5,0,0),Y.halfHeight.set(0,I.height*.5,0),n.rectArea[A]=Y,A++}else if(I.isPointLight){let Y=e.get(I);if(Y.color.copy(I.color).multiplyScalar(I.intensity),Y.distance=I.distance,Y.decay=I.decay,I.castShadow){let j=I.shadow,ee=t.get(I);ee.shadowIntensity=j.intensity,ee.shadowBias=j.bias,ee.shadowNormalBias=j.normalBias,ee.shadowRadius=j.radius,ee.shadowMapSize=j.mapSize,ee.shadowCameraNear=j.camera.near,ee.shadowCameraFar=j.camera.far,n.pointShadow[f]=ee,n.pointShadowMap[f]=ne,n.pointShadowMatrix[f]=I.shadow.matrix,T++}n.point[f]=Y,f++}else if(I.isHemisphereLight){let Y=e.get(I);Y.skyColor.copy(I.color).multiplyScalar(G),Y.groundColor.copy(I.groundColor).multiplyScalar(G),n.hemi[v]=Y,v++}}A>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=he.LTC_FLOAT_1,n.rectAreaLTC2=he.LTC_FLOAT_2):(n.rectAreaLTC1=he.LTC_HALF_1,n.rectAreaLTC2=he.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=h;let U=n.hash;(U.sunLength!==m||U.directionalLength!==p||U.pointLength!==f||U.spotLength!==M||U.rectAreaLength!==A||U.hemiLength!==v||U.numSunShadows!==x||U.numDirectionalShadows!==b||U.numPointShadows!==T||U.numSpotShadows!==R||U.numSpotMaps!==_||U.numLightProbes!==C)&&(n.sun.length=m,n.directional.length=p,n.spot.length=M,n.rectArea.length=A,n.point.length=f,n.hemi.length=v,n.sunShadow.length=x,n.sunShadowMap.length=x,n.sunShadowMatrix.length=S,n.sunShadowCascade.length=S,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=T,n.pointShadowMap.length=T,n.pointShadowMatrix.length=T,n.spotShadow.length=R,n.spotShadowMap.length=R,n.spotLightMatrix.length=R+_-E,n.spotLightMap.length=_,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=C,U.sunLength=m,U.directionalLength=p,U.pointLength=f,U.spotLength=M,U.rectAreaLength=A,U.hemiLength=v,U.numSunShadows=x,U.numDirectionalShadows=b,U.numPointShadows=T,U.numSpotShadows=R,U.numSpotMaps=_,U.numLightProbes=C,n.version=Ug++)}function c(l,u){let d=0,h=0,m=0,x=0,S=0,p=0,f=u.matrixWorldInverse;for(let M=0,A=l.length;M<A;M++){let v=l[M];if(v.isSunLight){let b=n.sun[d];b.direction.setFromMatrixPosition(v.matrixWorld),b.direction.transformDirection(f),d++}else if(v.isDirectionalLight){let b=n.directional[h];b.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(f),h++}else if(v.isSpotLight){let b=n.spot[x];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(f),b.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(f),x++}else if(v.isRectAreaLight){let b=n.rectArea[S];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(f),a.identity(),r.copy(v.matrixWorld),r.premultiply(f),a.extractRotation(r),b.halfWidth.set(v.width*.5,0,0),b.halfHeight.set(0,v.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),S++}else if(v.isPointLight){let b=n.point[m];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(f),m++}else if(v.isHemisphereLight){let b=n.hemi[p];b.direction.setFromMatrixPosition(v.matrixWorld),b.direction.transformDirection(f),p++}}}return{setup:o,setupView:c,state:n}}function gh(i){let e=new Og(i),t=[],n=[],s=[];function r(h){d.camera=h,t.length=0,n.length=0,s.length=0}function a(h){t.push(h)}function o(h){n.push(h)}function c(h){s.push(h)}function l(){e.setup(t)}function u(h){e.setupView(t,h)}let d={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:l,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function Bg(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new gh(i),e.set(s,[o])):r>=a.length?(o=new gh(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var zg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Vg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Hg=[new P(1,0,0),new P(-1,0,0),new P(0,1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1)],kg=[new P(0,-1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1),new P(0,-1,0),new P(0,-1,0)],_h=new mt,Vs=new P,ol=new P;function Gg(i,e,t){let n=new Bi,s=new ke,r=new ke,a=new pt,o=new Dr,c=new Ur,l={},u=t.maxTextureSize,d={[Jn]:zt,[zt]:Jn,[Kt]:Kt},h=new Bt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ke},radius:{value:4}},vertexShader:zg,fragmentShader:Vg}),m=h.clone();m.defines.HORIZONTAL_PASS=1;let x=new At;x.setAttribute("position",new Tt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let S=new rt(x,h),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ps;let f=this.type;this.render=function(T,R,_){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;this.type===uc&&(Le("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Ps);let E=i.getRenderTarget(),C=i.getActiveCubeFace(),U=i.getActiveMipmapLevel(),F=i.state;F.setBlending(yn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let B=f!==this.type;B&&R.traverse(function(I){I.material&&(Array.isArray(I.material)?I.material.forEach(k=>k.needsUpdate=!0):I.material.needsUpdate=!0)});for(let I=0,k=T.length;I<k;I++){let G=T[I],q=G.shadow;if(q===void 0){Le("WebGLShadowMap:",G,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);let ne=q.getFrameExtents();s.multiply(ne),r.copy(q.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ne.x),s.x=r.x*ne.x,q.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ne.y),s.y=r.y*ne.y,q.mapSize.y=r.y));let Y=i.state.buffers.depth.getReversed();if(q.camera._reversedDepth=Y,q.map===null||B===!0){if(q.map!==null&&(q.map.depthTexture!==null&&(q.map.depthTexture.dispose(),q.map.depthTexture=null),q.map.dispose()),this.type===Hi){if(G.isPointLight){Le("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}q.map=new Vt(s.x,s.y,{format:jn,type:hn,minFilter:Ct,magFilter:Ct,generateMipmaps:!1}),q.map.texture.name=G.name+".shadowMap",q.map.depthTexture=new Gn(s.x,s.y,cn),q.map.depthTexture.name=G.name+".shadowMapDepth",q.map.depthTexture.format=mn,q.map.depthTexture.compareFunction=null,q.map.depthTexture.minFilter=wt,q.map.depthTexture.magFilter=wt}else G.isPointLight?(q.map=new za(s.x),q.map.depthTexture=new Pr(s.x,ln)):(q.map=new Vt(s.x,s.y),q.map.depthTexture=new Gn(s.x,s.y,ln)),q.map.depthTexture.name=G.name+".shadowMap",q.map.depthTexture.format=mn,this.type===Ps?(q.map.depthTexture.compareFunction=Y?Ua:Da,q.map.depthTexture.minFilter=Ct,q.map.depthTexture.magFilter=Ct):(q.map.depthTexture.compareFunction=null,q.map.depthTexture.minFilter=wt,q.map.depthTexture.magFilter=wt);q.camera.updateProjectionMatrix()}q.map.isWebGLCubeRenderTarget!==!0&&(q.map.width!==s.x||q.map.height!==s.y)&&q.map.setSize(s.x,s.y);let j=q.map.isWebGLCubeRenderTarget?6:q.getViewportCount();G.isPointLight!==!0&&q.updateMatrices(G,_);for(let ee=0;ee<j;ee++){let Me=q.getCamera(ee);if(G.isPointLight){let we=q.camera,at=q.matrix,ze=G.distance||we.far;ze!==we.far&&(we.far=ze,we.updateProjectionMatrix()),Vs.setFromMatrixPosition(G.matrixWorld),we.position.copy(Vs),ol.copy(we.position),ol.add(Hg[ee]),we.up.copy(kg[ee]),we.lookAt(ol),we.updateMatrixWorld(),at.makeTranslation(-Vs.x,-Vs.y,-Vs.z),_h.multiplyMatrices(we.projectionMatrix,we.matrixWorldInverse),q._frustum.setFromProjectionMatrix(_h,we.coordinateSystem,we.reversedDepth)}if(q.map.isWebGLCubeRenderTarget)i.setRenderTarget(q.map,ee),i.clear();else{ee===0&&(i.setRenderTarget(q.map),i.clear());let we=q.getViewport(ee);a.set(r.x*we.x,r.y*we.y,r.x*we.z,r.y*we.w),F.viewport(a)}n=q.getFrustum(ee),v(R,_,Me,G,this.type)}q.isPointLightShadow!==!0&&this.type===Hi&&M(q,_),q.needsUpdate=!1}f=this.type,p.needsUpdate=!1,i.setRenderTarget(E,C,U)};function M(T,R){let _=e.update(S);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,m.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,m.needsUpdate=!0),T.mapPass===null?T.mapPass=new Vt(s.x,s.y,{format:jn,type:hn}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),h.uniforms.shadow_pass.value=T.map.depthTexture,h.uniforms.resolution.value.set(T.map.width,T.map.height),h.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(R,null,_,h,S,null),m.uniforms.shadow_pass.value=T.mapPass.texture,m.uniforms.resolution.value.set(T.map.width,T.map.height),m.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(R,null,_,m,S,null)}function A(T,R,_,E){let C=null,U=_.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(U!==void 0)C=U;else if(C=_.isPointLight===!0?c:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){let F=C.uuid,B=R.uuid,I=l[F];I===void 0&&(I={},l[F]=I);let k=I[B];k===void 0&&(k=C.clone(),I[B]=k,R.addEventListener("dispose",b)),C=k}if(C.visible=R.visible,C.wireframe=R.wireframe,E===Hi?C.side=R.shadowSide!==null?R.shadowSide:R.side:C.side=R.shadowSide!==null?R.shadowSide:d[R.side],C.alphaMap=R.alphaMap,C.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,C.map=R.map,C.clipShadows=R.clipShadows,C.clippingPlanes=R.clippingPlanes,C.clipIntersection=R.clipIntersection,C.displacementMap=R.displacementMap,C.displacementScale=R.displacementScale,C.displacementBias=R.displacementBias,C.wireframeLinewidth=R.wireframeLinewidth,C.linewidth=R.linewidth,_.isPointLight===!0&&C.isMeshDistanceMaterial===!0){let F=i.properties.get(C);F.light=_}return C}function v(T,R,_,E,C){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&C===Hi)&&(!T.frustumCulled||T.intersectsFrustum(n))){T.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,T.matrixWorld);let B=e.update(T),I=T.material;if(Array.isArray(I)){let k=B.groups;for(let G=0,q=k.length;G<q;G++){let ne=k[G],Y=I[ne.materialIndex];if(Y&&Y.visible){let j=A(T,Y,E,C);T.onBeforeShadow(i,T,R,_,B,j,ne),i.renderBufferDirect(_,null,B,j,T,ne),T.onAfterShadow(i,T,R,_,B,j,ne)}}}else if(I.visible){let k=A(T,I,E,C);T.onBeforeShadow(i,T,R,_,B,k,null),i.renderBufferDirect(_,null,B,k,T,null),T.onAfterShadow(i,T,R,_,B,k,null)}}let F=T.children;for(let B=0,I=F.length;B<I;B++)v(F[B],R,_,E,C)}function b(T){T.target.removeEventListener("dispose",b);for(let _ in l){let E=l[_],C=T.target.uuid;C in E&&(E[C].dispose(),delete E[C])}}}function Wg(i,e){function t(){let N=!1,le=new pt,K=null,ce=new pt(0,0,0,0);return{setMask:function(pe){K!==pe&&!N&&(i.colorMask(pe,pe,pe,pe),K=pe)},setLocked:function(pe){N=pe},setClear:function(pe,te,Ce,be,ht){ht===!0&&(pe*=be,te*=be,Ce*=be),le.set(pe,te,Ce,be),ce.equals(le)===!1&&(i.clearColor(pe,te,Ce,be),ce.copy(le))},reset:function(){N=!1,K=null,ce.set(-1,0,0,0)}}}function n(){let N=!1,le=!1,K=null,ce=null,pe=null;return{setReversed:function(te){if(le!==te){let Ce=e.get("EXT_clip_control");te?Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.ZERO_TO_ONE_EXT):Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.NEGATIVE_ONE_TO_ONE_EXT),le=te;let be=pe;pe=null,this.setClear(be)}},getReversed:function(){return le},setTest:function(te){te?Q(i.DEPTH_TEST):_e(i.DEPTH_TEST)},setMask:function(te){K!==te&&!N&&(i.depthMask(te),K=te)},setFunc:function(te){if(le&&(te=qc[te]),ce!==te){switch(te){case mr:i.depthFunc(i.NEVER);break;case gr:i.depthFunc(i.ALWAYS);break;case _r:i.depthFunc(i.LESS);break;case Ii:i.depthFunc(i.LEQUAL);break;case xr:i.depthFunc(i.EQUAL);break;case yr:i.depthFunc(i.GEQUAL);break;case vr:i.depthFunc(i.GREATER);break;case Mr:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ce=te}},setLocked:function(te){N=te},setClear:function(te){pe!==te&&(pe=te,le&&(te=1-te),i.clearDepth(te))},reset:function(){N=!1,K=null,ce=null,pe=null,le=!1}}}function s(){let N=!1,le=null,K=null,ce=null,pe=null,te=null,Ce=null,be=null,ht=null;return{setTest:function(tt){N||(tt?Q(i.STENCIL_TEST):_e(i.STENCIL_TEST))},setMask:function(tt){le!==tt&&!N&&(i.stencilMask(tt),le=tt)},setFunc:function(tt,jt,un){(K!==tt||ce!==jt||pe!==un)&&(i.stencilFunc(tt,jt,un),K=tt,ce=jt,pe=un)},setOp:function(tt,jt,un){(te!==tt||Ce!==jt||be!==un)&&(i.stencilOp(tt,jt,un),te=tt,Ce=jt,be=un)},setLocked:function(tt){N=tt},setClear:function(tt){ht!==tt&&(i.clearStencil(tt),ht=tt)},reset:function(){N=!1,le=null,K=null,ce=null,pe=null,te=null,Ce=null,be=null,ht=null}}}let r=new t,a=new n,o=new s,c=new WeakMap,l=new WeakMap,u={},d={},h={},m=new WeakMap,x=[],S=null,p=!1,f=null,M=null,A=null,v=null,b=null,T=null,R=null,_=new Pe(0,0,0),E=0,C=!1,U=null,F=null,B=null,I=null,k=null,G=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),q=!1,ne=0,Y=i.getParameter(i.VERSION);Y.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(Y)[1]),q=ne>=1):Y.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),q=ne>=2);let j=null,ee={},Me=i.getParameter(i.SCISSOR_BOX),we=i.getParameter(i.VIEWPORT),at=new pt().fromArray(Me),ze=new pt().fromArray(we);function je(N,le,K,ce){let pe=new Uint8Array(4),te=i.createTexture();i.bindTexture(N,te),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ce=0;Ce<K;Ce++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(le,0,i.RGBA,1,1,ce,0,i.RGBA,i.UNSIGNED_BYTE,pe):i.texImage2D(le+Ce,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,pe);return te}let J={};J[i.TEXTURE_2D]=je(i.TEXTURE_2D,i.TEXTURE_2D,1),J[i.TEXTURE_CUBE_MAP]=je(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[i.TEXTURE_2D_ARRAY]=je(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),J[i.TEXTURE_3D]=je(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Q(i.DEPTH_TEST),a.setFunc(Ii),Re(!1),Be(Ao),Q(i.CULL_FACE),qe(yn);function Q(N){u[N]!==!0&&(i.enable(N),u[N]=!0)}function _e(N){u[N]!==!1&&(i.disable(N),u[N]=!1)}function Ue(N,le){return h[N]!==le?(i.bindFramebuffer(N,le),h[N]=le,N===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=le),N===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=le),!0):!1}function me(N,le){let K=x,ce=!1;if(N){K=m.get(le),K===void 0&&(K=[],m.set(le,K));let pe=N.textures;if(K.length!==pe.length||K[0]!==i.COLOR_ATTACHMENT0){for(let te=0,Ce=pe.length;te<Ce;te++)K[te]=i.COLOR_ATTACHMENT0+te;K.length=pe.length,ce=!0}}else K[0]!==i.BACK&&(K[0]=i.BACK,ce=!0);ce&&i.drawBuffers(K)}function Ve(N){return S!==N?(i.useProgram(N),S=N,!0):!1}let gt={[hi]:i.FUNC_ADD,[fc]:i.FUNC_SUBTRACT,[pc]:i.FUNC_REVERSE_SUBTRACT};gt[mc]=i.MIN,gt[gc]=i.MAX;let We={[_c]:i.ZERO,[xc]:i.ONE,[yc]:i.SRC_COLOR,[Po]:i.SRC_ALPHA,[Tc]:i.SRC_ALPHA_SATURATE,[bc]:i.DST_COLOR,[Mc]:i.DST_ALPHA,[vc]:i.ONE_MINUS_SRC_COLOR,[Io]:i.ONE_MINUS_SRC_ALPHA,[Ec]:i.ONE_MINUS_DST_COLOR,[Sc]:i.ONE_MINUS_DST_ALPHA,[wc]:i.CONSTANT_COLOR,[Ac]:i.ONE_MINUS_CONSTANT_COLOR,[Rc]:i.CONSTANT_ALPHA,[Cc]:i.ONE_MINUS_CONSTANT_ALPHA};function qe(N,le,K,ce,pe,te,Ce,be,ht,tt){if(N===yn){p===!0&&(_e(i.BLEND),p=!1);return}if(p===!1&&(Q(i.BLEND),p=!0),N!==dc){if(N!==f||tt!==C){if((M!==hi||b!==hi)&&(i.blendEquation(i.FUNC_ADD),M=hi,b=hi),tt)switch(N){case ki:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Gi:i.blendFunc(i.ONE,i.ONE);break;case Ro:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Co:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:De("WebGLState: Invalid blending: ",N);break}else switch(N){case ki:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Gi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Ro:De("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Co:De("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:De("WebGLState: Invalid blending: ",N);break}A=null,v=null,T=null,R=null,_.set(0,0,0),E=0,f=N,C=tt}return}pe=pe||le,te=te||K,Ce=Ce||ce,(le!==M||pe!==b)&&(i.blendEquationSeparate(gt[le],gt[pe]),M=le,b=pe),(K!==A||ce!==v||te!==T||Ce!==R)&&(i.blendFuncSeparate(We[K],We[ce],We[te],We[Ce]),A=K,v=ce,T=te,R=Ce),(be.equals(_)===!1||ht!==E)&&(i.blendColor(be.r,be.g,be.b,ht),_.copy(be),E=ht),f=N,C=!1}function fe(N,le){N.side===Kt?_e(i.CULL_FACE):Q(i.CULL_FACE);let K=N.side===zt;le&&(K=!K),Re(K),N.blending===ki&&N.transparent===!1?qe(yn):qe(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),r.setMask(N.colorWrite);let ce=N.stencilWrite;o.setTest(ce),ce&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Qe(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?Q(i.SAMPLE_ALPHA_TO_COVERAGE):_e(i.SAMPLE_ALPHA_TO_COVERAGE)}function Re(N){U!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),U=N)}function Be(N){N!==cc?(Q(i.CULL_FACE),N!==F&&(N===Ao?i.cullFace(i.BACK):N===hc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):_e(i.CULL_FACE),F=N}function Ye(N){N!==B&&(q&&i.lineWidth(N),B=N)}function Qe(N,le,K){N?(Q(i.POLYGON_OFFSET_FILL),(I!==le||k!==K)&&(I=le,k=K,a.getReversed()&&(le=-le),i.polygonOffset(le,K))):_e(i.POLYGON_OFFSET_FILL)}function Xe(N){N?Q(i.SCISSOR_TEST):_e(i.SCISSOR_TEST)}function ct(N){N===void 0&&(N=i.TEXTURE0+G-1),j!==N&&(i.activeTexture(N),j=N)}function D(N,le,K){K===void 0&&(j===null?K=i.TEXTURE0+G-1:K=j);let ce=ee[K];ce===void 0&&(ce={type:void 0,texture:void 0},ee[K]=ce),(ce.type!==N||ce.texture!==le)&&(j!==K&&(i.activeTexture(K),j=K),i.bindTexture(N,le||J[N]),ce.type=N,ce.texture=le)}function vt(){let N=ee[j];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function Je(){try{i.compressedTexImage2D(...arguments)}catch(N){De("WebGLState:",N)}}function w(){try{i.compressedTexImage3D(...arguments)}catch(N){De("WebGLState:",N)}}function g(){try{i.texSubImage2D(...arguments)}catch(N){De("WebGLState:",N)}}function O(){try{i.texSubImage3D(...arguments)}catch(N){De("WebGLState:",N)}}function H(){try{i.compressedTexSubImage2D(...arguments)}catch(N){De("WebGLState:",N)}}function X(){try{i.compressedTexSubImage3D(...arguments)}catch(N){De("WebGLState:",N)}}function ie(){try{i.texStorage2D(...arguments)}catch(N){De("WebGLState:",N)}}function se(){try{i.texStorage3D(...arguments)}catch(N){De("WebGLState:",N)}}function Z(){try{i.texImage2D(...arguments)}catch(N){De("WebGLState:",N)}}function $(){try{i.texImage3D(...arguments)}catch(N){De("WebGLState:",N)}}function re(N){return d[N]!==void 0?d[N]:i.getParameter(N)}function Se(N,le){d[N]!==le&&(i.pixelStorei(N,le),d[N]=le)}function ae(N){at.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),at.copy(N))}function oe(N){ze.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),ze.copy(N))}function Ae(N,le){let K=l.get(le);K===void 0&&(K=new WeakMap,l.set(le,K));let ce=K.get(N);ce===void 0&&(ce=i.getUniformBlockIndex(le,N.name),K.set(N,ce))}function Ie(N,le){let ce=l.get(le).get(N);c.get(le)!==ce&&(i.uniformBlockBinding(le,ce,N.__bindingPointIndex),c.set(le,ce))}function Oe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},d={},j=null,ee={},h={},m=new WeakMap,x=[],S=null,p=!1,f=null,M=null,A=null,v=null,b=null,T=null,R=null,_=new Pe(0,0,0),E=0,C=!1,U=null,F=null,B=null,I=null,k=null,at.set(0,0,i.canvas.width,i.canvas.height),ze.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:Q,disable:_e,bindFramebuffer:Ue,drawBuffers:me,useProgram:Ve,setBlending:qe,setMaterial:fe,setFlipSided:Re,setCullFace:Be,setLineWidth:Ye,setPolygonOffset:Qe,setScissorTest:Xe,activeTexture:ct,bindTexture:D,unbindTexture:vt,compressedTexImage2D:Je,compressedTexImage3D:w,texImage2D:Z,texImage3D:$,pixelStorei:Se,getParameter:re,updateUBOMapping:Ae,uniformBlockBinding:Ie,texStorage2D:ie,texStorage3D:se,texSubImage2D:g,texSubImage3D:O,compressedTexSubImage2D:H,compressedTexSubImage3D:X,scissor:ae,viewport:oe,reset:Oe}}function Xg(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ke,u=new WeakMap,d=new Set,h,m=new WeakMap,x=!1;try{x=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(w,g){return x?new OffscreenCanvas(w,g):ps("canvas")}function p(w,g,O){let H=1,X=Je(w);if((X.width>O||X.height>O)&&(H=O/Math.max(X.width,X.height)),H<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){let ie=Math.floor(H*X.width),se=Math.floor(H*X.height);h===void 0&&(h=S(ie,se));let Z=g?S(ie,se):h;return Z.width=ie,Z.height=se,Z.getContext("2d").drawImage(w,0,0,ie,se),Le("WebGLRenderer: Texture has been resized from ("+X.width+"x"+X.height+") to ("+ie+"x"+se+")."),Z}else return"data"in w&&Le("WebGLRenderer: Image in DataTexture is too big ("+X.width+"x"+X.height+")."),w;return w}function f(w){return w.generateMipmaps}function M(w){i.generateMipmap(w)}function A(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(w,g,O,H,X,ie=!1){if(w!==null){if(i[w]!==void 0)return i[w];Le("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let se;H&&(se=e.get("EXT_texture_norm16"),se||Le("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=g;if(g===i.RED&&(O===i.FLOAT&&(Z=i.R32F),O===i.HALF_FLOAT&&(Z=i.R16F),O===i.UNSIGNED_BYTE&&(Z=i.R8),O===i.UNSIGNED_SHORT&&se&&(Z=se.R16_EXT),O===i.SHORT&&se&&(Z=se.R16_SNORM_EXT)),g===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(Z=i.R8UI),O===i.UNSIGNED_SHORT&&(Z=i.R16UI),O===i.UNSIGNED_INT&&(Z=i.R32UI),O===i.BYTE&&(Z=i.R8I),O===i.SHORT&&(Z=i.R16I),O===i.INT&&(Z=i.R32I)),g===i.RG&&(O===i.FLOAT&&(Z=i.RG32F),O===i.HALF_FLOAT&&(Z=i.RG16F),O===i.UNSIGNED_BYTE&&(Z=i.RG8),O===i.UNSIGNED_SHORT&&se&&(Z=se.RG16_EXT),O===i.SHORT&&se&&(Z=se.RG16_SNORM_EXT)),g===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(Z=i.RG8UI),O===i.UNSIGNED_SHORT&&(Z=i.RG16UI),O===i.UNSIGNED_INT&&(Z=i.RG32UI),O===i.BYTE&&(Z=i.RG8I),O===i.SHORT&&(Z=i.RG16I),O===i.INT&&(Z=i.RG32I)),g===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),O===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),O===i.UNSIGNED_INT&&(Z=i.RGB32UI),O===i.BYTE&&(Z=i.RGB8I),O===i.SHORT&&(Z=i.RGB16I),O===i.INT&&(Z=i.RGB32I)),g===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),O===i.UNSIGNED_INT&&(Z=i.RGBA32UI),O===i.BYTE&&(Z=i.RGBA8I),O===i.SHORT&&(Z=i.RGBA16I),O===i.INT&&(Z=i.RGBA32I)),g===i.RGB&&(O===i.UNSIGNED_SHORT&&se&&(Z=se.RGB16_EXT),O===i.SHORT&&se&&(Z=se.RGB16_SNORM_EXT),O===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),O===i.UNSIGNED_INT_10F_11F_11F_REV&&(Z=i.R11F_G11F_B10F)),g===i.RGBA){let $=ie?fs:$e.getTransfer(X);O===i.FLOAT&&(Z=i.RGBA32F),O===i.HALF_FLOAT&&(Z=i.RGBA16F),O===i.UNSIGNED_BYTE&&(Z=$===it?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT&&se&&(Z=se.RGBA16_EXT),O===i.SHORT&&se&&(Z=se.RGBA16_SNORM_EXT),O===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function b(w,g){let O;return w?g===null||g===ln||g===Xi?O=i.DEPTH24_STENCIL8:g===cn?O=i.DEPTH32F_STENCIL8:g===Wi&&(O=i.DEPTH24_STENCIL8,Le("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===ln||g===Xi?O=i.DEPTH_COMPONENT24:g===cn?O=i.DEPTH_COMPONENT32F:g===Wi&&(O=i.DEPTH_COMPONENT16),O}function T(w,g){return f(w)===!0||w.isFramebufferTexture&&w.minFilter!==wt&&w.minFilter!==Ct?Math.log2(Math.max(g.width,g.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?g.mipmaps.length:1}function R(w){let g=w.target;g.removeEventListener("dispose",R),E(g),g.isVideoTexture&&u.delete(g),g.isHTMLTexture&&d.delete(g)}function _(w){let g=w.target;g.removeEventListener("dispose",_),U(g)}function E(w){let g=n.get(w);if(g.__webglInit===void 0)return;let O=w.source,H=m.get(O);if(H){let X=H[g.__cacheKey];X.usedTimes--,X.usedTimes===0&&C(w),Object.keys(H).length===0&&m.delete(O)}n.remove(w)}function C(w){let g=n.get(w);i.deleteTexture(g.__webglTexture);let O=w.source,H=m.get(O);delete H[g.__cacheKey],a.memory.textures--}function U(w){let g=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let H=0;H<6;H++){if(Array.isArray(g.__webglFramebuffer[H]))for(let X=0;X<g.__webglFramebuffer[H].length;X++)i.deleteFramebuffer(g.__webglFramebuffer[H][X]);else i.deleteFramebuffer(g.__webglFramebuffer[H]);g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer[H])}else{if(Array.isArray(g.__webglFramebuffer))for(let H=0;H<g.__webglFramebuffer.length;H++)i.deleteFramebuffer(g.__webglFramebuffer[H]);else i.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&i.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let H=0;H<g.__webglColorRenderbuffer.length;H++)g.__webglColorRenderbuffer[H]&&i.deleteRenderbuffer(g.__webglColorRenderbuffer[H]);g.__webglDepthRenderbuffer&&i.deleteRenderbuffer(g.__webglDepthRenderbuffer)}let O=w.textures;for(let H=0,X=O.length;H<X;H++){let ie=n.get(O[H]);ie.__webglTexture&&(i.deleteTexture(ie.__webglTexture),a.memory.textures--),n.remove(O[H])}n.remove(w)}let F=0;function B(){F=0}function I(){return F}function k(w){F=w}function G(){let w=F;return w>=s.maxTextures&&Le("WebGLTextures: Trying to use "+(w+1)+" texture units while this GPU supports only "+s.maxTextures),F+=1,w}function q(w){let g=[];return g.push(w.wrapS),g.push(w.wrapT),g.push(w.wrapR||0),g.push(w.magFilter),g.push(w.minFilter),g.push(w.anisotropy),g.push(w.internalFormat),g.push(w.format),g.push(w.type),g.push(w.generateMipmaps),g.push(w.premultiplyAlpha),g.push(w.flipY),g.push(w.unpackAlignment),g.push(w.colorSpace),g.join()}function ne(w,g){let O=n.get(w);if(w.isVideoTexture&&D(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&O.__version!==w.version){let H=w.image;if(H===null)Le("WebGLRenderer: Texture marked for update but no image data found.");else if(H.complete===!1)Le("WebGLRenderer: Texture marked for update but image is incomplete");else{_e(O,w,g);return}}else w.isExternalTexture&&(O.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+g)}function Y(w,g){let O=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&O.__version!==w.version){_e(O,w,g);return}else w.isExternalTexture&&(O.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+g)}function j(w,g){let O=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&O.__version!==w.version){_e(O,w,g);return}t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+g)}function ee(w,g){let O=n.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&O.__version!==w.version){Ue(O,w,g);return}t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+g)}let Me={[Sr]:i.REPEAT,[pn]:i.CLAMP_TO_EDGE,[br]:i.MIRRORED_REPEAT},we={[wt]:i.NEAREST,[Lc]:i.NEAREST_MIPMAP_NEAREST,[Ls]:i.NEAREST_MIPMAP_LINEAR,[Ct]:i.LINEAR,[$r]:i.LINEAR_MIPMAP_NEAREST,[Kn]:i.LINEAR_MIPMAP_LINEAR},at={[Fc]:i.NEVER,[Hc]:i.ALWAYS,[Oc]:i.LESS,[Da]:i.LEQUAL,[Bc]:i.EQUAL,[Ua]:i.GEQUAL,[zc]:i.GREATER,[Vc]:i.NOTEQUAL};function ze(w,g){if(g.type===cn&&e.has("OES_texture_float_linear")===!1&&(g.magFilter===Ct||g.magFilter===$r||g.magFilter===Ls||g.magFilter===Kn||g.minFilter===Ct||g.minFilter===$r||g.minFilter===Ls||g.minFilter===Kn)&&Le("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,Me[g.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,Me[g.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,Me[g.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,we[g.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,we[g.minFilter]),g.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,at[g.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===wt||g.minFilter!==Ls&&g.minFilter!==Kn||g.type===cn&&e.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||n.get(g).__currentAnisotropy){let O=e.get("EXT_texture_filter_anisotropic");i.texParameterf(w,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,s.getMaxAnisotropy())),n.get(g).__currentAnisotropy=g.anisotropy}}}function je(w,g){let O=!1;w.__webglInit===void 0&&(w.__webglInit=!0,g.addEventListener("dispose",R));let H=g.source,X=m.get(H);X===void 0&&(X={},m.set(H,X));let ie=q(g);if(ie!==w.__cacheKey){X[ie]===void 0&&(X[ie]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),X[ie].usedTimes++;let se=X[w.__cacheKey];se!==void 0&&(X[w.__cacheKey].usedTimes--,se.usedTimes===0&&C(g)),w.__cacheKey=ie,w.__webglTexture=X[ie].texture}return O}function J(w,g,O){return Math.floor(Math.floor(w/O)/g)}function Q(w,g,O,H){let ie=w.updateRanges;if(ie.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,g.width,g.height,O,H,g.data);else{ie.sort((Se,ae)=>Se.start-ae.start);let se=0;for(let Se=1;Se<ie.length;Se++){let ae=ie[se],oe=ie[Se],Ae=ae.start+ae.count,Ie=J(oe.start,g.width,4),Oe=J(ae.start,g.width,4);oe.start<=Ae+1&&Ie===Oe&&J(oe.start+oe.count-1,g.width,4)===Ie?ae.count=Math.max(ae.count,oe.start+oe.count-ae.start):(++se,ie[se]=oe)}ie.length=se+1;let Z=t.getParameter(i.UNPACK_ROW_LENGTH),$=t.getParameter(i.UNPACK_SKIP_PIXELS),re=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,g.width);for(let Se=0,ae=ie.length;Se<ae;Se++){let oe=ie[Se],Ae=Math.floor(oe.start/4),Ie=Math.ceil(oe.count/4),Oe=Ae%g.width,N=Math.floor(Ae/g.width),le=Ie,K=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Oe),t.pixelStorei(i.UNPACK_SKIP_ROWS,N),t.texSubImage2D(i.TEXTURE_2D,0,Oe,N,le,K,O,H,g.data)}w.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,Z),t.pixelStorei(i.UNPACK_SKIP_PIXELS,$),t.pixelStorei(i.UNPACK_SKIP_ROWS,re)}}function _e(w,g,O){let H=i.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(H=i.TEXTURE_2D_ARRAY),g.isData3DTexture&&(H=i.TEXTURE_3D);let X=je(w,g),ie=g.source;t.bindTexture(H,w.__webglTexture,i.TEXTURE0+O);let se=n.get(ie);if(ie.version!==se.__version||X===!0){if(t.activeTexture(i.TEXTURE0+O),(typeof ImageBitmap<"u"&&g.image instanceof ImageBitmap)===!1){let K=$e.getPrimaries($e.workingColorSpace),ce=g.colorSpace===Cn?null:$e.getPrimaries(g.colorSpace),pe=g.colorSpace===Cn||K===ce?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,pe)}t.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment);let $=p(g.image,!1,s.maxTextureSize);$=vt(g,$);let re=r.convert(g.format,g.colorSpace),Se=r.convert(g.type),ae=v(g.internalFormat,re,Se,g.normalized,g.colorSpace,g.isVideoTexture);ze(H,g);let oe,Ae=g.mipmaps,Ie=g.isVideoTexture!==!0,Oe=se.__version===void 0||X===!0,N=ie.dataReady,le=T(g,$);if(g.isDepthTexture)ae=b(g.format===Qn,g.type),Oe&&(Ie?t.texStorage2D(i.TEXTURE_2D,1,ae,$.width,$.height):t.texImage2D(i.TEXTURE_2D,0,ae,$.width,$.height,0,re,Se,null));else if(g.isDataTexture)if(Ae.length>0){Ie&&Oe&&t.texStorage2D(i.TEXTURE_2D,le,ae,Ae[0].width,Ae[0].height);for(let K=0,ce=Ae.length;K<ce;K++)oe=Ae[K],Ie?N&&t.texSubImage2D(i.TEXTURE_2D,K,0,0,oe.width,oe.height,re,Se,oe.data):t.texImage2D(i.TEXTURE_2D,K,ae,oe.width,oe.height,0,re,Se,oe.data);g.generateMipmaps=!1}else Ie?(Oe&&t.texStorage2D(i.TEXTURE_2D,le,ae,$.width,$.height),N&&Q(g,$,re,Se)):t.texImage2D(i.TEXTURE_2D,0,ae,$.width,$.height,0,re,Se,$.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){Ie&&Oe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,le,ae,Ae[0].width,Ae[0].height,$.depth);for(let K=0,ce=Ae.length;K<ce;K++)if(oe=Ae[K],g.format!==Qt)if(re!==null)if(Ie){if(N)if(g.layerUpdates.size>0){let pe=tl(oe.width,oe.height,g.format,g.type);for(let te of g.layerUpdates){let Ce=oe.data.subarray(te*pe/oe.data.BYTES_PER_ELEMENT,(te+1)*pe/oe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,te,oe.width,oe.height,1,re,Ce)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,oe.width,oe.height,$.depth,re,oe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,K,ae,oe.width,oe.height,$.depth,0,oe.data,0,0);else Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ie?N&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,oe.width,oe.height,$.depth,re,Se,oe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,K,ae,oe.width,oe.height,$.depth,0,re,Se,oe.data);g.layerUpdates.size>0&&g.clearLayerUpdates()}else{Ie&&Oe&&t.texStorage2D(i.TEXTURE_2D,le,ae,Ae[0].width,Ae[0].height);for(let K=0,ce=Ae.length;K<ce;K++)oe=Ae[K],g.format!==Qt?re!==null?Ie?N&&t.compressedTexSubImage2D(i.TEXTURE_2D,K,0,0,oe.width,oe.height,re,oe.data):t.compressedTexImage2D(i.TEXTURE_2D,K,ae,oe.width,oe.height,0,oe.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ie?N&&t.texSubImage2D(i.TEXTURE_2D,K,0,0,oe.width,oe.height,re,Se,oe.data):t.texImage2D(i.TEXTURE_2D,K,ae,oe.width,oe.height,0,re,Se,oe.data)}else if(g.isDataArrayTexture)if(Ie){if(Oe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,le,ae,$.width,$.height,$.depth),N)if(g.layerUpdates.size>0){let K=tl($.width,$.height,g.format,g.type);for(let ce of g.layerUpdates){let pe=$.data.subarray(ce*K/$.data.BYTES_PER_ELEMENT,(ce+1)*K/$.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ce,$.width,$.height,1,re,Se,pe)}g.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,$.width,$.height,$.depth,re,Se,$.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,ae,$.width,$.height,$.depth,0,re,Se,$.data);else if(g.isData3DTexture)Ie?(Oe&&t.texStorage3D(i.TEXTURE_3D,le,ae,$.width,$.height,$.depth),N&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,$.width,$.height,$.depth,re,Se,$.data)):t.texImage3D(i.TEXTURE_3D,0,ae,$.width,$.height,$.depth,0,re,Se,$.data);else if(g.isFramebufferTexture){if(Oe)if(Ie)t.texStorage2D(i.TEXTURE_2D,le,ae,$.width,$.height);else{let K=$.width,ce=$.height;for(let pe=0;pe<le;pe++)t.texImage2D(i.TEXTURE_2D,pe,ae,K,ce,0,re,Se,null),K>>=1,ce>>=1}}else if(g.isHTMLTexture){if("texElementImage2D"in i){let K=i.canvas;if(K.hasAttribute("layoutsubtree")||K.setAttribute("layoutsubtree","true"),$.parentNode!==K){K.appendChild($),d.add(g),K.onpaint=ce=>{let pe=ce.changedElements;for(let te of d)pe.includes(te.image)&&(te.needsUpdate=!0)},K.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,$);else{let pe=i.RGBA,te=i.RGBA,Ce=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,pe,te,Ce,$)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Ae.length>0){if(Ie&&Oe){let K=Je(Ae[0]);t.texStorage2D(i.TEXTURE_2D,le,ae,K.width,K.height)}for(let K=0,ce=Ae.length;K<ce;K++)oe=Ae[K],Ie?N&&t.texSubImage2D(i.TEXTURE_2D,K,0,0,re,Se,oe):t.texImage2D(i.TEXTURE_2D,K,ae,re,Se,oe);g.generateMipmaps=!1}else if(Ie){if(Oe){let K=Je($);t.texStorage2D(i.TEXTURE_2D,le,ae,K.width,K.height)}N&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,re,Se,$)}else t.texImage2D(i.TEXTURE_2D,0,ae,re,Se,$);f(g)&&M(H),se.__version=ie.version,g.onUpdate&&g.onUpdate(g)}w.__version=g.version}function Ue(w,g,O){if(g.image.length!==6)return;let H=je(w,g),X=g.source;t.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+O);let ie=n.get(X);if(X.version!==ie.__version||H===!0){t.activeTexture(i.TEXTURE0+O);let se=$e.getPrimaries($e.workingColorSpace),Z=g.colorSpace===Cn?null:$e.getPrimaries(g.colorSpace),$=g.colorSpace===Cn||se===Z?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,$);let re=g.isCompressedTexture||g.image[0].isCompressedTexture,Se=g.image[0]&&g.image[0].isDataTexture,ae=[];for(let te=0;te<6;te++)!re&&!Se?ae[te]=p(g.image[te],!0,s.maxCubemapSize):ae[te]=Se?g.image[te].image:g.image[te],ae[te]=vt(g,ae[te]);let oe=ae[0],Ae=r.convert(g.format,g.colorSpace),Ie=r.convert(g.type),Oe=v(g.internalFormat,Ae,Ie,g.normalized,g.colorSpace),N=g.isVideoTexture!==!0,le=ie.__version===void 0||H===!0,K=X.dataReady,ce=T(g,oe);ze(i.TEXTURE_CUBE_MAP,g);let pe;if(re){N&&le&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ce,Oe,oe.width,oe.height);for(let te=0;te<6;te++){pe=ae[te].mipmaps;for(let Ce=0;Ce<pe.length;Ce++){let be=pe[Ce];g.format!==Qt?Ae!==null?N?K&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ce,0,0,be.width,be.height,Ae,be.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ce,Oe,be.width,be.height,0,be.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?K&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ce,0,0,be.width,be.height,Ae,Ie,be.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ce,Oe,be.width,be.height,0,Ae,Ie,be.data)}}}else{if(pe=g.mipmaps,N&&le){pe.length>0&&ce++;let te=Je(ae[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ce,Oe,te.width,te.height)}for(let te=0;te<6;te++)if(Se){N?K&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,ae[te].width,ae[te].height,Ae,Ie,ae[te].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Oe,ae[te].width,ae[te].height,0,Ae,Ie,ae[te].data);for(let Ce=0;Ce<pe.length;Ce++){let ht=pe[Ce].image[te].image;N?K&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ce+1,0,0,ht.width,ht.height,Ae,Ie,ht.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ce+1,Oe,ht.width,ht.height,0,Ae,Ie,ht.data)}}else{N?K&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Ae,Ie,ae[te]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Oe,Ae,Ie,ae[te]);for(let Ce=0;Ce<pe.length;Ce++){let be=pe[Ce];N?K&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ce+1,0,0,Ae,Ie,be.image[te]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ce+1,Oe,Ae,Ie,be.image[te])}}}f(g)&&M(i.TEXTURE_CUBE_MAP),ie.__version=X.version,g.onUpdate&&g.onUpdate(g)}w.__version=g.version}function me(w,g,O,H,X,ie){let se=r.convert(O.format,O.colorSpace),Z=r.convert(O.type),$=v(O.internalFormat,se,Z,O.normalized,O.colorSpace),re=n.get(g),Se=n.get(O);if(Se.__renderTarget=g,!re.__hasExternalTextures){let ae=Math.max(1,g.width>>ie),oe=Math.max(1,g.height>>ie);X===i.TEXTURE_3D||X===i.TEXTURE_2D_ARRAY?t.texImage3D(X,ie,$,ae,oe,g.depth,0,se,Z,null):t.texImage2D(X,ie,$,ae,oe,0,se,Z,null)}t.bindFramebuffer(i.FRAMEBUFFER,w),ct(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,H,X,Se.__webglTexture,0,Xe(g)):(X===i.TEXTURE_2D||X>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&X<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,H,X,Se.__webglTexture,ie),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ve(w,g,O){if(i.bindRenderbuffer(i.RENDERBUFFER,w),g.depthBuffer){let H=g.depthTexture,X=H&&H.isDepthTexture?H.type:null,ie=b(g.stencilBuffer,X),se=g.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;ct(g)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Xe(g),ie,g.width,g.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,Xe(g),ie,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,ie,g.width,g.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,se,i.RENDERBUFFER,w)}else{let H=g.textures;for(let X=0;X<H.length;X++){let ie=H[X],se=r.convert(ie.format,ie.colorSpace),Z=r.convert(ie.type),$=v(ie.internalFormat,se,Z,ie.normalized,ie.colorSpace);ct(g)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Xe(g),$,g.width,g.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,Xe(g),$,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,$,g.width,g.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function gt(w,g,O){let H=g.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,w),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let X=n.get(g.depthTexture);if(X.__renderTarget=g,(!X.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),H){if(X.__webglInit===void 0&&(X.__webglInit=!0,g.depthTexture.addEventListener("dispose",R)),X.__webglTexture===void 0){X.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),ze(i.TEXTURE_CUBE_MAP,g.depthTexture);let re=r.convert(g.depthTexture.format),Se=r.convert(g.depthTexture.type),ae;g.depthTexture.format===mn?ae=i.DEPTH_COMPONENT24:g.depthTexture.format===Qn&&(ae=i.DEPTH24_STENCIL8);for(let oe=0;oe<6;oe++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,ae,g.width,g.height,0,re,Se,null)}}else ne(g.depthTexture,0);let ie=X.__webglTexture,se=Xe(g),Z=H?i.TEXTURE_CUBE_MAP_POSITIVE_X+O:i.TEXTURE_2D,$=g.depthTexture.format===Qn?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(g.depthTexture.format===mn)ct(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,Z,ie,0,se):i.framebufferTexture2D(i.FRAMEBUFFER,$,Z,ie,0);else if(g.depthTexture.format===Qn)ct(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,Z,ie,0,se):i.framebufferTexture2D(i.FRAMEBUFFER,$,Z,ie,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function We(w){let g=n.get(w),O=w.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==w.depthTexture){let H=w.depthTexture;if(g.__depthDisposeCallback&&g.__depthDisposeCallback(),H){let X=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,H.removeEventListener("dispose",X)};H.addEventListener("dispose",X),g.__depthDisposeCallback=X}g.__boundDepthTexture=H}if(w.depthTexture&&!g.__autoAllocateDepthBuffer)if(O)for(let H=0;H<6;H++)gt(g.__webglFramebuffer[H],w,H);else{let H=w.texture.mipmaps;H&&H.length>0?gt(g.__webglFramebuffer[0],w,0):gt(g.__webglFramebuffer,w,0)}else if(O){g.__webglDepthbuffer=[];for(let H=0;H<6;H++)if(t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[H]),g.__webglDepthbuffer[H]===void 0)g.__webglDepthbuffer[H]=i.createRenderbuffer(),Ve(g.__webglDepthbuffer[H],w,!1);else{let X=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ie=g.__webglDepthbuffer[H];i.bindRenderbuffer(i.RENDERBUFFER,ie),i.framebufferRenderbuffer(i.FRAMEBUFFER,X,i.RENDERBUFFER,ie)}}else{let H=w.texture.mipmaps;if(H&&H.length>0?t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=i.createRenderbuffer(),Ve(g.__webglDepthbuffer,w,!1);else{let X=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ie=g.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ie),i.framebufferRenderbuffer(i.FRAMEBUFFER,X,i.RENDERBUFFER,ie)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function qe(w,g,O){let H=n.get(w);g!==void 0&&me(H.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&We(w)}function fe(w){let g=w.texture,O=n.get(w),H=n.get(g);w.addEventListener("dispose",_);let X=w.textures,ie=w.isWebGLCubeRenderTarget===!0,se=X.length>1;if(se||(H.__webglTexture===void 0&&(H.__webglTexture=i.createTexture()),H.__version=g.version,a.memory.textures++),ie){O.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(g.mipmaps&&g.mipmaps.length>0){O.__webglFramebuffer[Z]=[];for(let $=0;$<g.mipmaps.length;$++)O.__webglFramebuffer[Z][$]=i.createFramebuffer()}else O.__webglFramebuffer[Z]=i.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){O.__webglFramebuffer=[];for(let Z=0;Z<g.mipmaps.length;Z++)O.__webglFramebuffer[Z]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(se)for(let Z=0,$=X.length;Z<$;Z++){let re=n.get(X[Z]);re.__webglTexture===void 0&&(re.__webglTexture=i.createTexture(),a.memory.textures++)}if(w.samples>0&&ct(w)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let Z=0;Z<X.length;Z++){let $=X[Z];O.__webglColorRenderbuffer[Z]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[Z]);let re=r.convert($.format,$.colorSpace),Se=r.convert($.type),ae=v($.internalFormat,re,Se,$.normalized,$.colorSpace,w.isXRRenderTarget===!0),oe=Xe(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,oe,ae,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Z,i.RENDERBUFFER,O.__webglColorRenderbuffer[Z])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),Ve(O.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ie){t.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture),ze(i.TEXTURE_CUBE_MAP,g);for(let Z=0;Z<6;Z++)if(g.mipmaps&&g.mipmaps.length>0)for(let $=0;$<g.mipmaps.length;$++)me(O.__webglFramebuffer[Z][$],w,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,$);else me(O.__webglFramebuffer[Z],w,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);f(g)&&M(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(se){for(let Z=0,$=X.length;Z<$;Z++){let re=X[Z],Se=n.get(re),ae=i.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ae=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ae,Se.__webglTexture),ze(ae,re),me(O.__webglFramebuffer,w,re,i.COLOR_ATTACHMENT0+Z,ae,0),f(re)&&M(ae)}t.unbindTexture()}else{let Z=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(Z=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Z,H.__webglTexture),ze(Z,g),g.mipmaps&&g.mipmaps.length>0)for(let $=0;$<g.mipmaps.length;$++)me(O.__webglFramebuffer[$],w,g,i.COLOR_ATTACHMENT0,Z,$);else me(O.__webglFramebuffer,w,g,i.COLOR_ATTACHMENT0,Z,0);f(g)&&M(Z),t.unbindTexture()}w.depthBuffer&&We(w)}function Re(w){let g=w.textures;for(let O=0,H=g.length;O<H;O++){let X=g[O];if(f(X)){let ie=A(w),se=n.get(X).__webglTexture;t.bindTexture(ie,se),M(ie),t.unbindTexture()}}}let Be=[],Ye=[];function Qe(w){if(w.samples>0){if(ct(w)===!1){let g=w.textures,O=w.width,H=w.height,X=i.COLOR_BUFFER_BIT,ie=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,se=n.get(w),Z=g.length>1;if(Z)for(let re=0;re<g.length;re++)t.bindFramebuffer(i.FRAMEBUFFER,se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+re,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+re,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,se.__webglMultisampledFramebuffer);let $=w.texture.mipmaps;$&&$.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,se.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,se.__webglFramebuffer);for(let re=0;re<g.length;re++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(X|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(X|=i.STENCIL_BUFFER_BIT)),Z){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,se.__webglColorRenderbuffer[re]);let Se=n.get(g[re]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Se,0)}i.blitFramebuffer(0,0,O,H,0,0,O,H,X,i.NEAREST),c===!0&&(Be.length=0,Ye.length=0,Be.push(i.COLOR_ATTACHMENT0+re),w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&(Be.push(ie),Ye.push(ie),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ye)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Be))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Z)for(let re=0;re<g.length;re++){t.bindFramebuffer(i.FRAMEBUFFER,se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+re,i.RENDERBUFFER,se.__webglColorRenderbuffer[re]);let Se=n.get(g[re]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+re,i.TEXTURE_2D,Se,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,se.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&c){let g=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[g])}}}function Xe(w){return Math.min(s.maxSamples,w.samples)}function ct(w){let g=n.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function D(w){let g=a.render.frame;u.get(w)!==g&&(u.set(w,g),w.update())}function vt(w,g){let O=w.colorSpace,H=w.format,X=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||O!==ds&&O!==Cn&&($e.getTransfer(O)===it?(H!==Qt||X!==Ht)&&Le("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):De("WebGLTextures: Unsupported texture color space:",O)),g}function Je(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(l.width=w.naturalWidth||w.width,l.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(l.width=w.displayWidth,l.height=w.displayHeight):(l.width=w.width,l.height=w.height),l}this.allocateTextureUnit=G,this.resetTextureUnits=B,this.getTextureUnits=I,this.setTextureUnits=k,this.setTexture2D=ne,this.setTexture2DArray=Y,this.setTexture3D=j,this.setTextureCube=ee,this.rebindTextures=qe,this.setupRenderTarget=fe,this.updateRenderTargetMipmap=Re,this.updateMultisampleRenderTarget=Qe,this.setupDepthRenderbuffer=We,this.setupFrameBufferTexture=me,this.useMultisampledRTT=ct,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function qg(i,e){function t(n,s=Cn){let r,a=$e.getTransfer(s);if(n===Ht)return i.UNSIGNED_BYTE;if(n===Qr)return i.UNSIGNED_SHORT_4_4_4_4;if(n===jr)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Go)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Wo)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Ho)return i.BYTE;if(n===ko)return i.SHORT;if(n===Wi)return i.UNSIGNED_SHORT;if(n===Kr)return i.INT;if(n===ln)return i.UNSIGNED_INT;if(n===cn)return i.FLOAT;if(n===hn)return i.HALF_FLOAT;if(n===Xo)return i.ALPHA;if(n===qo)return i.RGB;if(n===Qt)return i.RGBA;if(n===mn)return i.DEPTH_COMPONENT;if(n===Qn)return i.DEPTH_STENCIL;if(n===Yo)return i.RED;if(n===ea)return i.RED_INTEGER;if(n===jn)return i.RG;if(n===ta)return i.RG_INTEGER;if(n===na)return i.RGBA_INTEGER;if(n===Ns||n===Ds||n===Us||n===Fs)if(a===it)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ns)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ds)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Us)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Fs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ns)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ds)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Us)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Fs)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ia||n===sa||n===ra||n===aa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ia)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===sa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ra)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===aa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===oa||n===la||n===ca||n===ha||n===ua||n===Os||n===da)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===oa||n===la)return a===it?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ca)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===ha)return r.COMPRESSED_R11_EAC;if(n===ua)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Os)return r.COMPRESSED_RG11_EAC;if(n===da)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===fa||n===pa||n===ma||n===ga||n===_a||n===xa||n===ya||n===va||n===Ma||n===Sa||n===ba||n===Ea||n===Ta||n===wa)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===fa)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===pa)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ma)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ga)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===_a)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===xa)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ya)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===va)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ma)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Sa)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ba)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ea)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ta)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===wa)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Aa||n===Ra||n===Ca)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Aa)return a===it?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ra)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ca)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Pa||n===Ia||n===Bs||n===La)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Pa)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ia)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Bs)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===La)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Xi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var Yg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Zg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,ml=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Ms(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Bt({vertexShader:Yg,fragmentShader:Zg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new rt(new oi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},gl=class extends gn{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",c=1,l=null,u=null,d=null,h=null,m=null,x=null,S=typeof XRWebGLBinding<"u",p=new ml,f={},M=t.getContextAttributes(),A=null,v=null,b=[],T=[],R=new ke,_=null,E=null,C=new Mt;C.viewport=new pt;let U=new Mt;U.viewport=new pt;let F=[C,U],B=new Yr,I=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let Q=b[J];return Q===void 0&&(Q=new Fi,b[J]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(J){let Q=b[J];return Q===void 0&&(Q=new Fi,b[J]=Q),Q.getGripSpace()},this.getHand=function(J){let Q=b[J];return Q===void 0&&(Q=new Fi,b[J]=Q),Q.getHandSpace()};function G(J){let Q=T.indexOf(J.inputSource);if(Q===-1)return;let _e=b[Q];_e!==void 0&&(_e.update(J.inputSource,J.frame,l||a),_e.dispatchEvent({type:J.type,data:J.inputSource}))}function q(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",ne);for(let J=0;J<b.length;J++){let Q=T[J];Q!==null&&(T[J]=null,b[J].disconnect(Q))}I=null,k=null,p.reset();for(let J in f)delete f[J];if(e.setRenderTarget(A),m=null,h=null,d=null,s=null,v=null,je.stop(),n.isPresenting=!1,e.setPixelRatio(_),e.setSize(R.width,R.height,!1),E!==null){let J=E.camera;J.fov=E.fov,J.zoom=E.zoom,J.updateProjectionMatrix(),E=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&Le("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&Le("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return h!==null?h:m},this.getBinding=function(){return d===null&&S&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(A=e.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",q),s.addEventListener("inputsourceschange",ne),M.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(R),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let _e=null,Ue=null,me=null;M.depth&&(me=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,_e=M.stencil?Qn:mn,Ue=M.stencil?Xi:ln);let Ve={colorFormat:t.RGBA8,depthFormat:me,scaleFactor:r};d=this.getBinding(),h=d.createProjectionLayer(Ve),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),v=new Vt(h.textureWidth,h.textureHeight,{format:Qt,type:Ht,depthTexture:new Gn(h.textureWidth,h.textureHeight,Ue,void 0,void 0,void 0,void 0,void 0,void 0,_e),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let _e={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,_e),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),v=new Vt(m.framebufferWidth,m.framebufferHeight,{format:Qt,type:Ht,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1,storeMultisampledDepthBuffer:m.ignoreDepthValues===!1,storeMultisampledStencilBuffer:m.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),je.setContext(s),je.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function ne(J){for(let Q=0;Q<J.removed.length;Q++){let _e=J.removed[Q],Ue=T.indexOf(_e);Ue>=0&&(T[Ue]=null,b[Ue].disconnect(_e))}for(let Q=0;Q<J.added.length;Q++){let _e=J.added[Q],Ue=T.indexOf(_e);if(Ue===-1){for(let Ve=0;Ve<b.length;Ve++)if(Ve>=T.length){T.push(_e),Ue=Ve;break}else if(T[Ve]===null){T[Ve]=_e,Ue=Ve;break}if(Ue===-1)break}let me=b[Ue];me&&me.connect(_e)}}let Y=new P,j=new P;function ee(J,Q,_e){Y.setFromMatrixPosition(Q.matrixWorld),j.setFromMatrixPosition(_e.matrixWorld);let Ue=Y.distanceTo(j),me=Q.projectionMatrix.elements,Ve=_e.projectionMatrix.elements,gt=me[14]/(me[10]-1),We=me[14]/(me[10]+1),qe=(me[9]+1)/me[5],fe=(me[9]-1)/me[5],Re=(me[8]-1)/me[0],Be=(Ve[8]+1)/Ve[0],Ye=gt*Re,Qe=gt*Be,Xe=Ue/(-Re+Be),ct=Xe*-Re;if(Q.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(ct),J.translateZ(Xe),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),me[10]===-1)J.projectionMatrix.copy(Q.projectionMatrix),J.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{let D=gt+Xe,vt=We+Xe,Je=Ye-ct,w=Qe+(Ue-ct),g=qe*We/vt*D,O=fe*We/vt*D;J.projectionMatrix.makePerspective(Je,w,g,O,D,vt),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function Me(J,Q){Q===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(Q.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let Q=J.near,_e=J.far;p.texture!==null&&(p.depthNear>0&&(Q=p.depthNear),p.depthFar>0&&(_e=p.depthFar)),B.near=U.near=C.near=Q,B.far=U.far=C.far=_e,(I!==B.near||k!==B.far)&&(s.updateRenderState({depthNear:B.near,depthFar:B.far}),I=B.near,k=B.far),B.layers.mask=J.layers.mask|6,C.layers.mask=B.layers.mask&-5,U.layers.mask=B.layers.mask&-3;let Ue=J.parent,me=B.cameras;Me(B,Ue);for(let Ve=0;Ve<me.length;Ve++)Me(me[Ve],Ue);me.length===2?ee(B,C,U):B.projectionMatrix.copy(C.projectionMatrix),E===null&&J.isPerspectiveCamera&&(E={camera:J,fov:J.fov,zoom:J.zoom}),we(J,B,Ue)};function we(J,Q,_e){_e===null?J.matrix.copy(Q.matrixWorld):(J.matrix.copy(_e.matrixWorld),J.matrix.invert(),J.matrix.multiply(Q.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(Q.projectionMatrix),J.projectionMatrixInverse.copy(Q.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Di*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(h===null&&m===null))return c},this.setFoveation=function(J){c=J,h!==null&&(h.fixedFoveation=J),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=J)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(B)},this.getCameraTexture=function(J){return f[J]};let at=null;function ze(J,Q){if(u=Q.getViewerPose(l||a),x=Q,u!==null){let _e=u.views;m!==null&&(e.setRenderTargetFramebuffer(v,m.framebuffer),e.setRenderTarget(v));let Ue=!1;_e.length!==B.cameras.length&&(B.cameras.length=0,Ue=!0);for(let We=0;We<_e.length;We++){let qe=_e[We],fe=null;if(m!==null)fe=m.getViewport(qe);else{let Be=d.getViewSubImage(h,qe);fe=Be.viewport,We===0&&(e.setRenderTargetTextures(v,Be.colorTexture,Be.depthStencilTexture),e.setRenderTarget(v))}let Re=F[We];Re===void 0&&(Re=new Mt,Re.layers.enable(We),Re.viewport=new pt,F[We]=Re),Re.matrix.fromArray(qe.transform.matrix),Re.matrix.decompose(Re.position,Re.quaternion,Re.scale),Re.projectionMatrix.fromArray(qe.projectionMatrix),Re.projectionMatrixInverse.copy(Re.projectionMatrix).invert(),Re.viewport.set(fe.x,fe.y,fe.width,fe.height),We===0&&(B.matrix.copy(Re.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),Ue===!0&&B.cameras.push(Re)}let me=s.enabledFeatures;if(me&&me.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&S){d=n.getBinding();let We=d.getDepthInformation(_e[0]);We&&We.isValid&&We.texture&&p.init(We,s.renderState)}if(me&&me.includes("camera-access")&&S){e.state.unbindTexture(),d=n.getBinding();for(let We=0;We<_e.length;We++){let qe=_e[We].camera;if(qe){let fe=f[qe];fe||(fe=new Ms,f[qe]=fe);let Re=d.getCameraImage(qe);fe.sourceTexture=Re}}}}for(let _e=0;_e<b.length;_e++){let Ue=T[_e],me=b[_e];Ue!==null&&me!==void 0&&me.update(Ue,Q,l||a)}at&&at(J,Q),Q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Q}),x=null}let je=new xh;je.setAnimationLoop(ze),this.setAnimationLoop=function(J){at=J},this.dispose=function(){}}},Jg=new mt,Eh=new Fe;Eh.set(-1,0,0,0,1,0,0,0,1);function $g(i,e){function t(p,f){p.matrixAutoUpdate===!0&&p.updateMatrix(),f.value.copy(p.matrix)}function n(p,f){f.color.getRGB(p.fogColor.value,Qo(i)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function s(p,f,M,A,v){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?r(p,f):f.isMeshLambertMaterial?(r(p,f),f.envMap&&(p.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(r(p,f),d(p,f)):f.isMeshPhongMaterial?(r(p,f),u(p,f),f.envMap&&(p.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(r(p,f),h(p,f),f.isMeshPhysicalMaterial&&m(p,f,v)):f.isMeshMatcapMaterial?(r(p,f),x(p,f)):f.isMeshDepthMaterial?r(p,f):f.isMeshDistanceMaterial?(r(p,f),S(p,f)):f.isMeshNormalMaterial?r(p,f):f.isLineBasicMaterial?(a(p,f),f.isLineDashedMaterial&&o(p,f)):f.isPointsMaterial?c(p,f,M,A):f.isSpriteMaterial?l(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.bumpMap&&(p.bumpMap.value=f.bumpMap,t(f.bumpMap,p.bumpMapTransform),p.bumpScale.value=f.bumpScale,f.side===zt&&(p.bumpScale.value*=-1)),f.normalMap&&(p.normalMap.value=f.normalMap,t(f.normalMap,p.normalMapTransform),p.normalScale.value.copy(f.normalScale),f.side===zt&&p.normalScale.value.negate()),f.displacementMap&&(p.displacementMap.value=f.displacementMap,t(f.displacementMap,p.displacementMapTransform),p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,p.emissiveMapTransform)),f.specularMap&&(p.specularMap.value=f.specularMap,t(f.specularMap,p.specularMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);let M=e.get(f),A=M.envMap,v=M.envMapRotation;A&&(p.envMap.value=A,p.envMapRotation.value.setFromMatrix4(Jg.makeRotationFromEuler(v)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(Eh),p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap&&(p.lightMap.value=f.lightMap,p.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,p.lightMapTransform)),f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,p.aoMapTransform))}function a(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform))}function o(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function c(p,f,M,A){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*M,p.scale.value=A*.5,f.map&&(p.map.value=f.map,t(f.map,p.uvTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function l(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function u(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function d(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function h(p,f){p.metalness.value=f.metalness,f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,p.metalnessMapTransform)),p.roughness.value=f.roughness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,p.roughnessMapTransform)),f.envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function m(p,f,M){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,p.sheenColorMapTransform)),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,p.sheenRoughnessMapTransform))),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,p.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(p.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===zt&&p.clearcoatNormalScale.value.negate())),f.dispersion>0&&(p.dispersion.value=f.dispersion),f.retroreflectivity>0&&(p.retroreflectivity.value=f.retroreflectivity),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,p.iridescenceMapTransform)),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=M.texture,p.transmissionSamplerSize.value.set(M.width,M.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,p.transmissionMapTransform)),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(p.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(p.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,p.specularColorMapTransform)),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,p.specularIntensityMapTransform))}function x(p,f){f.matcap&&(p.matcap.value=f.matcap)}function S(p,f){let M=e.get(f).light;p.referencePosition.value.setFromMatrixPosition(M.matrixWorld),p.nearDistance.value=M.shadow.camera.near,p.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Kg(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,b){let T=b.program;n.uniformBlockBinding(v,T)}function l(v,b){let T=s[v.id];T===void 0&&(p(v),T=u(v),s[v.id]=T,v.addEventListener("dispose",M));let R=b.program;n.updateUBOMapping(v,R);let _=e.render.frame;r[v.id]!==_&&(h(v),r[v.id]=_)}function u(v){let b=d();v.__bindingPointIndex=b;let T=i.createBuffer(),R=v.__size,_=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,R,_),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,T),T}function d(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return De("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){let b=s[v.id],T=v.uniforms,R=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let _=0,E=T.length;_<E;_++){let C=T[_];if(Array.isArray(C))for(let U=0,F=C.length;U<F;U++)m(C[U],_,U,R);else m(C,_,0,R)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(v,b,T,R){if(S(v,b,T,R)===!0){let _=v.__offset,E=v.value;if(Array.isArray(E)){let C=0;for(let U=0;U<E.length;U++){let F=E[U],B=f(F);x(F,v.__data,C),typeof F!="number"&&typeof F!="boolean"&&!F.isMatrix3&&!ArrayBuffer.isView(F)&&(C+=B.storage/Float32Array.BYTES_PER_ELEMENT)}}else x(E,v.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,_,v.__data)}}function x(v,b,T){typeof v=="number"||typeof v=="boolean"?b[0]=v:v.isMatrix3?(b[0]=v.elements[0],b[1]=v.elements[1],b[2]=v.elements[2],b[3]=0,b[4]=v.elements[3],b[5]=v.elements[4],b[6]=v.elements[5],b[7]=0,b[8]=v.elements[6],b[9]=v.elements[7],b[10]=v.elements[8],b[11]=0):ArrayBuffer.isView(v)?b.set(new v.constructor(v.buffer,v.byteOffset,b.length)):v.toArray(b,T)}function S(v,b,T,R){let _=v.value,E=b+"_"+T;if(R[E]===void 0)return typeof _=="number"||typeof _=="boolean"?R[E]=_:ArrayBuffer.isView(_)?R[E]=_.slice():R[E]=_.clone(),!0;{let C=R[E];if(typeof _=="number"||typeof _=="boolean"){if(C!==_)return R[E]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(C.equals(_)===!1)return C.copy(_),!0}}return!1}function p(v){let b=v.uniforms,T=0,R=16;for(let E=0,C=b.length;E<C;E++){let U=Array.isArray(b[E])?b[E]:[b[E]];for(let F=0,B=U.length;F<B;F++){let I=U[F],k=Array.isArray(I.value)?I.value:[I.value];for(let G=0,q=k.length;G<q;G++){let ne=k[G],Y=f(ne),j=T%R,ee=j%Y.boundary,Me=j+ee;T+=ee,Me!==0&&R-Me<Y.storage&&(T+=R-Me),I.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=T,T+=Y.storage}}}let _=T%R;return _>0&&(T+=R-_),v.__size=T,v.__cache={},this}function f(v){let b={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(b.boundary=4,b.storage=4):v.isVector2?(b.boundary=8,b.storage=8):v.isVector3||v.isColor?(b.boundary=16,b.storage=12):v.isVector4?(b.boundary=16,b.storage=16):v.isMatrix3?(b.boundary=48,b.storage=48):v.isMatrix4?(b.boundary=64,b.storage=64):v.isTexture?Le("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(b.boundary=16,b.storage=v.byteLength):Le("WebGLRenderer: Unsupported uniform value type.",v),b}function M(v){let b=v.target;b.removeEventListener("dispose",M);let T=a.indexOf(b.__bindingPointIndex);a.splice(T,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function A(){for(let v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:c,update:l,dispose:A}}var Qg=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),vn=null;function jg(){return vn===null&&(vn=new Cr(Qg,16,16,jn,hn),vn.name="DFG_LUT",vn.minFilter=Ct,vn.magFilter=Ct,vn.wrapS=pn,vn.wrapT=pn,vn.generateMipmaps=!1,vn.needsUpdate=!0),vn}var $i=class{constructor(e={}){let{canvas:t=Gc(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1,outputBufferType:m=Ht}=e;this.isWebGLRenderer=!0;let x;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");x=n.getContextAttributes().alpha}else x=a;let S=m,p=new Set([na,ta,ea]),f=new Set([Ht,ln,Wi,Xi,Qr,jr]),M=new Uint32Array(4),A=new Int32Array(4),v=new P,b=null,T=null,R=[],_=[],E=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Yt,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let C=this,U=!1,F=null,B=null,I=null,k=null;this._outputColorSpace=Rt;let G=0,q=0,ne=null,Y=-1,j=null,ee=new pt,Me=new pt,we=null,at=new Pe(0),ze=0,je=t.width,J=t.height,Q=1,_e=null,Ue=null,me=new pt(0,0,je,J),Ve=new pt(0,0,je,J),gt=!1,We=new Bi,qe=!1,fe=!1,Re=new mt,Be=new P,Ye=new pt,Qe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Xe=!1;function ct(){return ne===null?Q:1}let D=n;function vt(y,L){return t.getContext(y,L)}let Je,w,g,O,H,X,ie,se,Z,$,re,Se,ae,oe,Ae,Ie,Oe,N,le,K,ce,pe,te;try{let y={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",ht,!1),t.addEventListener("webglcontextrestored",tt,!1),t.addEventListener("webglcontextcreationerror",jt,!1),D===null){let L="webgl2";if(D=vt(L,y),D===null)throw vt(L)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ce()}catch(y){throw t.removeEventListener("webglcontextlost",ht,!1),t.removeEventListener("webglcontextrestored",tt,!1),t.removeEventListener("webglcontextcreationerror",jt,!1),De("WebGLRenderer: "+y.message),y}function Ce(){Je=new am(D),Je.init(),ce=new qg(D,Je),w=new $p(D,Je,e,ce),g=new Wg(D,Je),w.reversedDepthBuffer&&h&&g.buffers.depth.setReversed(!0),B=D.createFramebuffer(),I=D.createFramebuffer(),k=D.createFramebuffer(),O=new cm(D),H=new Pg,X=new Xg(D,Je,g,H,w,ce,O),ie=new rm(C),se=new hd(D),pe=new Zp(D,se),Z=new om(D,se,O,pe),$=new um(D,Z,se,pe,O),N=new hm(D,w,X),Ae=new Kp(H),re=new Cg(C,ie,Je,w,pe,Ae),Se=new $g(C,H),ae=new Lg,oe=new Bg(Je),Oe=new Yp(C,ie,g,$,x,c),Ie=new Gg(C,$,w),te=new Kg(D,O,w,g),le=new Jp(D,Je,O),K=new lm(D,Je,O),O.programs=re.programs,C.capabilities=w,C.extensions=Je,C.properties=H,C.renderLists=ae,C.shadowMap=Ie,C.state=g,C.info=O}S!==Ht&&(E=new fm(S,t.width,t.height,o,s,r));let be=new gl(C,D);this.xr=be,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){let y=Je.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){let y=Je.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return Q},this.setPixelRatio=function(y){y!==void 0&&(Q=y,this.setSize(je,J,!1))},this.getSize=function(y){return y.set(je,J)},this.setSize=function(y,L,W=!0){if(be.isPresenting){Le("WebGLRenderer: Can't change size while VR device is presenting.");return}je=y,J=L,t.width=Math.floor(y*Q),t.height=Math.floor(L*Q),W===!0&&(t.style.width=y+"px",t.style.height=L+"px"),E!==null&&E.setSize(t.width,t.height),this.setViewport(0,0,y,L)},this.getDrawingBufferSize=function(y){return y.set(je*Q,J*Q).floor()},this.setDrawingBufferSize=function(y,L,W){je=y,J=L,Q=W,t.width=Math.floor(y*W),t.height=Math.floor(L*W),this.setViewport(0,0,y,L)},this.setEffects=function(y){if(S===Ht){De("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let L=0;L<y.length;L++)if(y[L].isOutputPass===!0){Le("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(ee)},this.getViewport=function(y){return y.copy(me)},this.setViewport=function(y,L,W,z){y.isVector4?me.set(y.x,y.y,y.z,y.w):me.set(y,L,W,z),g.viewport(ee.copy(me).multiplyScalar(Q).round())},this.getScissor=function(y){return y.copy(Ve)},this.setScissor=function(y,L,W,z){y.isVector4?Ve.set(y.x,y.y,y.z,y.w):Ve.set(y,L,W,z),g.scissor(Me.copy(Ve).multiplyScalar(Q).round())},this.getScissorTest=function(){return gt},this.setScissorTest=function(y){g.setScissorTest(gt=y)},this.setOpaqueSort=function(y){_e=y},this.setTransparentSort=function(y){Ue=y},this.getClearColor=function(y){return y.copy(Oe.getClearColor())},this.setClearColor=function(){Oe.setClearColor(...arguments)},this.getClearAlpha=function(){return Oe.getClearAlpha()},this.setClearAlpha=function(){Oe.setClearAlpha(...arguments)},this.clear=function(y=!0,L=!0,W=!0){let z=0;if(y){let V=!1;if(ne!==null){let de=ne.texture.format;V=p.has(de)}if(V){let de=ne.texture.type,xe=f.has(de),ue=Oe.getClearColor(),ye=Oe.getClearAlpha(),Te=ue.r,He=ue.g,Ze=ue.b;xe?(M[0]=Te,M[1]=He,M[2]=Ze,M[3]=ye,D.clearBufferuiv(D.COLOR,0,M)):(A[0]=Te,A[1]=He,A[2]=Ze,A[3]=ye,D.clearBufferiv(D.COLOR,0,A))}else z|=D.COLOR_BUFFER_BIT}L&&(z|=D.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),W&&(z|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z!==0&&D.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),F=y},this.dispose=function(){t.removeEventListener("webglcontextlost",ht,!1),t.removeEventListener("webglcontextrestored",tt,!1),t.removeEventListener("webglcontextcreationerror",jt,!1),Oe.dispose(),ae.dispose(),oe.dispose(),H.dispose(),ie.dispose(),$.dispose(),pe.dispose(),te.dispose(),re.dispose(),be.dispose(),be.removeEventListener("sessionstart",Rl),be.removeEventListener("sessionend",Cl),ei.stop()};function ht(y){y.preventDefault(),$o("WebGLRenderer: Context Lost."),U=!0}function tt(){$o("WebGLRenderer: Context Restored."),U=!1;let y=O.autoReset,L=Ie.enabled,W=Ie.autoUpdate,z=Ie.needsUpdate,V=Ie.type;Ce(),O.autoReset=y,Ie.enabled=L,Ie.autoUpdate=W,Ie.needsUpdate=z,Ie.type=V}function jt(y){De("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function un(y){let L=y.target;L.removeEventListener("dispose",un),su(L)}function su(y){ru(y),H.remove(y)}function ru(y){let L=H.get(y).programs;L!==void 0&&(L.forEach(function(W){re.releaseProgram(W)}),y.isShaderMaterial&&re.releaseShaderCache(y))}this.renderBufferDirect=function(y,L,W,z,V,de){L===null&&(L=Qe);let xe=V.isMesh&&V.matrixWorld.determinantAffine()<0,ue=lu(y,L,W,z,V);g.setMaterial(z,xe);let ye=W.index,Te=1;if(z.wireframe===!0){if(ye=Z.getWireframeAttribute(W),ye===void 0)return;Te=2}let He=W.drawRange,Ze=W.attributes.position,ve=He.start*Te,nt=(He.start+He.count)*Te;de!==null&&(ve=Math.max(ve,de.start*Te),nt=Math.min(nt,(de.start+de.count)*Te)),ye!==null?(ve=Math.max(ve,0),nt=Math.min(nt,ye.count)):Ze!=null&&(ve=Math.max(ve,0),nt=Math.min(nt,Ze.count));let xt=nt-ve;if(xt<0||xt===1/0)return;pe.setup(V,z,ue,W,ye);let dt,lt=le;if(ye!==null&&(dt=se.get(ye),lt=K,lt.setIndex(dt)),V.isMesh)z.wireframe===!0?(g.setLineWidth(z.wireframeLinewidth*ct()),lt.setMode(D.LINES)):lt.setMode(D.TRIANGLES);else if(V.isLine){let Pt=z.linewidth;Pt===void 0&&(Pt=1),g.setLineWidth(Pt*ct()),V.isLineSegments?lt.setMode(D.LINES):V.isLineLoop?lt.setMode(D.LINE_LOOP):lt.setMode(D.LINE_STRIP)}else V.isPoints?lt.setMode(D.POINTS):V.isSprite&&lt.setMode(D.TRIANGLES);if(V.isBatchedMesh)if(Je.get("WEBGL_multi_draw"))lt.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{let Pt=V._multiDrawStarts,ge=V._multiDrawCounts,Ut=V._multiDrawCount,et=ye?se.get(ye).bytesPerElement:1,Jt=H.get(z).currentProgram.getUniforms();for(let dn=0;dn<Ut;dn++)Jt.setValue(D,"_gl_DrawID",dn),lt.render(Pt[dn]/et,ge[dn])}else if(V.isInstancedMesh)lt.renderInstances(ve,xt,V.count);else if(W.isInstancedBufferGeometry){let Pt=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,ge=Math.min(W.instanceCount,Pt);lt.renderInstances(ve,xt,ge)}else lt.render(ve,xt)};function Al(y,L,W,z){F!==null&&y.isNodeMaterial&&F.setObject(z,y),qe===!0&&Ae.setState(y,W,!1),y.transparent===!0&&y.side===Kt&&y.forceSinglePass===!1?(y.side=zt,y.needsUpdate=!0,Ys(y,L,z),y.side=Jn,y.needsUpdate=!0,Ys(y,L,z),y.side=Kt):Ys(y,L,z)}this.compile=function(y,L,W=null){W===null&&(W=y),F!==null&&F.renderStart(y,L,W),T=oe.get(W),T.init(L),_.push(T),W.traverseVisible(function(V){V.isLight&&V.layers.test(L.layers)&&(T.pushLight(V),V.castShadow&&T.pushShadow(V))}),y!==W&&y.traverseVisible(function(V){V.isLight&&V.layers.test(L.layers)&&(T.pushLight(V),V.castShadow&&T.pushShadow(V))}),T.setupLights(),F!==null&&F.updateLights(T.state.lightsArray),fe=this.localClippingEnabled,qe=Ae.init(this.clippingPlanes,fe),qe===!0&&Ae.setGlobalState(this.clippingPlanes,L),F!==null&&Ie.render(T.state.shadowsArray,W,L);let z=new Set;return y.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;let de=V.material;if(de)if(Array.isArray(de))for(let xe=0;xe<de.length;xe++){let ue=de[xe];Al(ue,W,L,V),z.add(ue)}else Al(de,W,L,V),z.add(de)}),T=_.pop(),F!==null&&F.renderEnd(),z},this.compileAsync=function(y,L,W=null){let z=this.compile(y,L,W);return new Promise(V=>{function de(){if(z.forEach(function(xe){let ye=H.get(xe).currentProgram;(ye===void 0||ye.isReady())&&z.delete(xe)}),z.size===0){V(y);return}setTimeout(de,10)}Je.get("KHR_parallel_shader_compile")!==null?de():setTimeout(de,10)})};let Ja=null;function au(y){Ja&&Ja(y)}function Rl(){ei.stop()}function Cl(){ei.start()}let ei=new xh;ei.setAnimationLoop(au),typeof self<"u"&&ei.setContext(self),this.setAnimationLoop=function(y){Ja=y,be.setAnimationLoop(y),y===null?ei.stop():ei.start()},be.addEventListener("sessionstart",Rl),be.addEventListener("sessionend",Cl),this.render=function(y,L){if(L!==void 0&&L.isCamera!==!0){De("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(U===!0)return;F!==null&&F.renderStart(y,L);let W=be.enabled===!0&&be.isPresenting===!0,z=E!==null&&(ne===null||W)&&E.begin(C,ne);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),L.parent===null&&L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),be.enabled===!0&&be.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(be.cameraAutoUpdate===!0&&be.updateCamera(L),L=be.getCamera()),y.isScene===!0&&y.onBeforeRender(C,y,L,ne),T=oe.get(y,_.length),T.init(L),T.state.textureUnits=X.getTextureUnits(),_.push(T),Re.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),We.setFromProjectionMatrix(Re,rn,L.reversedDepth),fe=this.localClippingEnabled,qe=Ae.init(this.clippingPlanes,fe),b=ae.get(y,R.length),b.init(),R.push(b),be.enabled===!0&&be.isPresenting===!0){let xe=C.xr.getDepthSensingMesh();xe!==null&&$a(xe,L,-1/0,C.sortObjects)}$a(y,L,0,C.sortObjects),b.finish(),F!==null&&F.updateLights(T.state.lightsArray),C.sortObjects===!0&&b.sort(_e,Ue),Xe=be.enabled===!1||be.isPresenting===!1||be.hasDepthSensing()===!1,Xe&&Oe.addToRenderList(b,y),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),qe===!0&&Ae.beginShadows();let V=T.state.shadowsArray;if(Ie.render(V,y,L),qe===!0&&Ae.endShadows(),(z&&E.hasRenderPass())===!1){let xe=b.opaque,ue=b.transmissive;if(T.setupLights(),L.isArrayCamera){let ye=L.cameras;if(ue.length>0)for(let Te=0,He=ye.length;Te<He;Te++){let Ze=ye[Te];Il(xe,ue,y,Ze)}Xe&&Oe.render(y);for(let Te=0,He=ye.length;Te<He;Te++){let Ze=ye[Te];Pl(b,y,Ze,Ze.viewport)}}else ue.length>0&&Il(xe,ue,y,L),Xe&&Oe.render(y),Pl(b,y,L)}ne!==null&&q===0&&(X.updateMultisampleRenderTarget(ne),X.updateRenderTargetMipmap(ne)),z&&E.end(C),y.isScene===!0&&y.onAfterRender(C,y,L),pe.resetDefaultState(),Y=-1,j=null,_.pop(),_.length>0?(T=_[_.length-1],X.setTextureUnits(T.state.textureUnits),qe===!0&&Ae.setGlobalState(C.clippingPlanes,T.state.camera)):T=null,R.pop(),R.length>0?b=R[R.length-1]:b=null,F!==null&&F.renderEnd()};function $a(y,L,W,z){if(y.visible===!1)return;if(y.layers.test(L.layers)){if(y.isGroup)W=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(L);else if(y.isLightProbeGrid)T.pushLightProbeGrid(y);else if(y.isLight)T.pushLight(y),y.castShadow&&T.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||y.intersectsFrustum(We)){z&&Ye.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Re);let xe=$.update(y),ue=y.material;ue.visible&&b.push(y,xe,ue,W,Ye.z,null,L)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||y.intersectsFrustum(We))){let xe=$.update(y),ue=y.material;if(z&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Ye.copy(y.boundingSphere.center)):(xe.boundingSphere===null&&xe.computeBoundingSphere(),Ye.copy(xe.boundingSphere.center)),Ye.applyMatrix4(y.matrixWorld).applyMatrix4(Re)),Array.isArray(ue)){let ye=xe.groups;for(let Te=0,He=ye.length;Te<He;Te++){let Ze=ye[Te],ve=ue[Ze.materialIndex];ve&&ve.visible&&b.push(y,xe,ve,W,Ye.z,Ze,L)}}else ue.visible&&b.push(y,xe,ue,W,Ye.z,null,L)}}let de=y.children;for(let xe=0,ue=de.length;xe<ue;xe++)$a(de[xe],L,W,z)}function Pl(y,L,W,z){let{opaque:V,transmissive:de,transparent:xe}=y;T.setupLightsView(W),qe===!0&&Ae.setGlobalState(C.clippingPlanes,W),z&&g.viewport(ee.copy(z)),V.length>0&&qs(V,L,W),de.length>0&&qs(de,L,W),xe.length>0&&qs(xe,L,W),g.buffers.depth.setTest(!0),g.buffers.depth.setMask(!0),g.buffers.color.setMask(!0),g.setPolygonOffset(!1)}function Il(y,L,W,z){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[z.id]===void 0){let ve=Je.has("EXT_color_buffer_half_float")||Je.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[z.id]=new Vt(1,1,{generateMipmaps:!0,type:ve?hn:Ht,minFilter:Kn,samples:Math.max(4,w.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:$e.workingColorSpace})}let de=T.state.transmissionRenderTarget[z.id],xe=z.viewport||ee;de.setSize(xe.z*C.transmissionResolutionScale,xe.w*C.transmissionResolutionScale);let ue=C.getRenderTarget(),ye=C.getActiveCubeFace(),Te=C.getActiveMipmapLevel();C.setRenderTarget(de),C.getClearColor(at),ze=C.getClearAlpha(),ze<1&&C.setClearColor(16777215,.5),C.clear(),Xe&&Oe.render(W);let He=C.toneMapping;C.toneMapping=Yt;let Ze=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),T.setupLightsView(z),qe===!0&&Ae.setGlobalState(C.clippingPlanes,z),qs(y,W,z),X.updateMultisampleRenderTarget(de),X.updateRenderTargetMipmap(de),Je.has("WEBGL_multisampled_render_to_texture")===!1){let ve=!1;for(let nt=0,xt=L.length;nt<xt;nt++){let dt=L[nt],{object:lt,geometry:Pt,material:ge,group:Ut}=dt;if(ge.side===Kt&&lt.layers.test(z.layers)){let et=ge.side;ge.side=zt,ge.needsUpdate=!0,Ll(lt,W,z,Pt,ge,Ut),ge.side=et,ge.needsUpdate=!0,ve=!0}}ve===!0&&(X.updateMultisampleRenderTarget(de),X.updateRenderTargetMipmap(de))}C.setRenderTarget(ue,ye,Te),C.setClearColor(at,ze),Ze!==void 0&&(z.viewport=Ze),C.toneMapping=He}function qs(y,L,W){let z=L.isScene===!0?L.overrideMaterial:null;for(let V=0,de=y.length;V<de;V++){let xe=y[V],{object:ue,geometry:ye,group:Te}=xe,He=xe.material;He.allowOverride===!0&&z!==null&&(He=z),ue.layers.test(W.layers)&&Ll(ue,L,W,ye,He,Te)}}function Ll(y,L,W,z,V,de){F!==null&&V.isNodeMaterial&&F.setObject(y,V),y.onBeforeRender(C,L,W,z,V,de),y.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),V.onBeforeRender(C,L,W,z,y,de),V.transparent===!0&&V.side===Kt&&V.forceSinglePass===!1?(V.side=zt,V.needsUpdate=!0,C.renderBufferDirect(W,L,z,V,y,de),V.side=Jn,V.needsUpdate=!0,C.renderBufferDirect(W,L,z,V,y,de),V.side=Kt):C.renderBufferDirect(W,L,z,V,y,de),y.onAfterRender(C,L,W,z,V,de)}function Ys(y,L,W){L.isScene!==!0&&(L=Qe);let z=H.get(y),V=T.state.lights,de=T.state.shadowsArray,xe=V.state.version,ue=re.getParameters(y,V.state,de,L,W,T.state.lightProbeGridArray),ye=re.getProgramCacheKey(ue),Te=z.programs;z.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?L.environment:null,z.fog=L.fog;let He=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;z.envMap=ie.get(y.envMap||z.environment,He),z.envMapRotation=z.environment!==null&&y.envMap===null?L.environmentRotation:y.envMapRotation,Te===void 0&&(y.addEventListener("dispose",un),Te=new Map,z.programs=Te);let Ze=Te.get(ye);if(Ze!==void 0){if(z.currentProgram===Ze&&z.lightsStateVersion===xe)return Dl(y,ue),Ze}else ue.uniforms=re.getUniforms(y),F!==null&&y.isNodeMaterial&&F.build(y,W,ue),y.onBeforeCompile(ue,C),Ze=re.acquireProgram(ue,ye),Te.set(ye,Ze),z.uniforms=ue.uniforms;let ve=z.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(ve.clippingPlanes=Ae.uniform),Dl(y,ue),z.needsLights=hu(y),z.lightsStateVersion=xe,z.needsLights&&(ve.ambientLightColor.value=V.state.ambient,ve.lightProbe.value=V.state.probe,ve.sunLights.value=V.state.sun,ve.sunLightShadows.value=V.state.sunShadow,ve.directionalLights.value=V.state.directional,ve.directionalLightShadows.value=V.state.directionalShadow,ve.spotLights.value=V.state.spot,ve.spotLightShadows.value=V.state.spotShadow,ve.rectAreaLights.value=V.state.rectArea,ve.ltc_1.value=V.state.rectAreaLTC1,ve.ltc_2.value=V.state.rectAreaLTC2,ve.pointLights.value=V.state.point,ve.pointLightShadows.value=V.state.pointShadow,ve.hemisphereLights.value=V.state.hemi,ve.sunShadowMatrix.value=V.state.sunShadowMatrix,ve.sunShadowCascade.value=V.state.sunShadowCascade,ve.directionalShadowMatrix.value=V.state.directionalShadowMatrix,ve.spotLightMatrix.value=V.state.spotLightMatrix,ve.spotLightMap.value=V.state.spotLightMap,ve.pointShadowMatrix.value=V.state.pointShadowMatrix),z.lightProbeGrid=T.state.lightProbeGridArray.length>0,z.currentProgram=Ze,z.uniformsList=null,Ze}function Nl(y){if(y.uniformsList===null){let L=y.currentProgram.getUniforms();y.uniformsList=Ji.seqWithValue(L.seq,y.uniforms)}return y.uniformsList}function Dl(y,L){let W=H.get(y);W.outputColorSpace=L.outputColorSpace,W.batching=L.batching,W.batchingColor=L.batchingColor,W.instancing=L.instancing,W.instancingColor=L.instancingColor,W.instancingMorph=L.instancingMorph,W.skinning=L.skinning,W.morphTargets=L.morphTargets,W.morphNormals=L.morphNormals,W.morphColors=L.morphColors,W.morphTargetsCount=L.morphTargetsCount,W.numClippingPlanes=L.numClippingPlanes,W.numIntersection=L.numClipIntersection,W.vertexAlphas=L.vertexAlphas,W.vertexTangents=L.vertexTangents,W.toneMapping=L.toneMapping}function ou(y,L){if(y.length===0)return null;if(y.length===1)return y[0].texture!==null?y[0]:null;v.setFromMatrixPosition(L.matrixWorld);for(let W=0,z=y.length;W<z;W++){let V=y[W];if(V.texture!==null&&V.boundingBox.containsPoint(v))return V}return null}function lu(y,L,W,z,V){L.isScene!==!0&&(L=Qe),X.resetTextureUnits();let de=L.fog,xe=z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial?L.environment:null,ue=ne===null?C.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:$e.workingColorSpace,ye=z.isMeshStandardMaterial||z.isMeshLambertMaterial&&!z.envMap||z.isMeshPhongMaterial&&!z.envMap,Te=ie.get(z.envMap||xe,ye),He=z.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Ze=!!W.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),ve=!!W.morphAttributes.position,nt=!!W.morphAttributes.normal,xt=!!W.morphAttributes.color,dt=Yt;z.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(dt=C.toneMapping);let lt=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Pt=lt!==void 0?lt.length:0,ge=H.get(z),Ut=T.state.lights;if(qe===!0&&(fe===!0||y!==j)){let ut=y===j&&z.id===Y;Ae.setState(z,y,ut)}let et=!1;z.version===ge.__version?(ge.needsLights&&ge.lightsStateVersion!==Ut.state.version||ge.outputColorSpace!==ue||V.isBatchedMesh&&ge.batching===!1||!V.isBatchedMesh&&ge.batching===!0||V.isBatchedMesh&&ge.batchingColor===!0&&V._colorsTexture===null||V.isBatchedMesh&&ge.batchingColor===!1&&V._colorsTexture!==null||V.isInstancedMesh&&ge.instancing===!1||!V.isInstancedMesh&&ge.instancing===!0||V.isSkinnedMesh&&ge.skinning===!1||!V.isSkinnedMesh&&ge.skinning===!0||V.isInstancedMesh&&ge.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&ge.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&ge.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&ge.instancingMorph===!1&&V.morphTexture!==null||ge.envMap!==Te||z.fog===!0&&ge.fog!==de||ge.numClippingPlanes!==void 0&&(ge.numClippingPlanes!==Ae.numPlanes||ge.numIntersection!==Ae.numIntersection)||ge.vertexAlphas!==He||ge.vertexTangents!==Ze||ge.morphTargets!==ve||ge.morphNormals!==nt||ge.morphColors!==xt||ge.toneMapping!==dt||ge.morphTargetsCount!==Pt||!!ge.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(et=!0):(et=!0,ge.__version=z.version);let Jt=ge.currentProgram;et===!0&&(Jt=Ys(z,L,V),F&&z.isNodeMaterial&&F.onUpdateProgram(z,Jt,ge));let dn=!1,Nn=!1,pi=!1,ot=Jt.getUniforms(),_t=ge.uniforms;if(g.useProgram(Jt.program)&&(dn=!0,Nn=!0,pi=!0),z.id!==Y&&(Y=z.id,Nn=!0),ge.needsLights){let ut=ou(T.state.lightProbeGridArray,V);ge.lightProbeGrid!==ut&&(ge.lightProbeGrid=ut,Nn=!0)}if(dn||j!==y){g.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),ot.setValue(D,"projectionMatrix",y.projectionMatrix),ot.setValue(D,"viewMatrix",y.matrixWorldInverse);let Un=ot.map.cameraPosition;Un!==void 0&&Un.setValue(D,Be.setFromMatrixPosition(y.matrixWorld)),w.logarithmicDepthBuffer&&ot.setValue(D,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&ot.setValue(D,"isOrthographic",y.isOrthographicCamera===!0),j!==y&&(j=y,Nn=!0,pi=!0)}if(ge.needsLights&&(Ut.state.sunShadowMap.length>0&&ot.setValue(D,"sunShadowMap",Ut.state.sunShadowMap,X),Ut.state.directionalShadowMap.length>0&&ot.setValue(D,"directionalShadowMap",Ut.state.directionalShadowMap,X),Ut.state.spotShadowMap.length>0&&ot.setValue(D,"spotShadowMap",Ut.state.spotShadowMap,X),Ut.state.pointShadowMap.length>0&&ot.setValue(D,"pointShadowMap",Ut.state.pointShadowMap,X)),V.isSkinnedMesh){ot.setOptional(D,V,"bindMatrix"),ot.setOptional(D,V,"bindMatrixInverse");let ut=V.skeleton;ut&&(ut.boneTexture===null&&ut.computeBoneTexture(),ot.setValue(D,"boneTexture",ut.boneTexture,X))}V.isBatchedMesh&&(ot.setOptional(D,V,"batchingTexture"),ot.setValue(D,"batchingTexture",V._matricesTexture,X),ot.setOptional(D,V,"batchingIdTexture"),ot.setValue(D,"batchingIdTexture",V._indirectTexture,X),ot.setOptional(D,V,"batchingColorTexture"),V._colorsTexture!==null&&ot.setValue(D,"batchingColorTexture",V._colorsTexture,X));let Dn=W.morphAttributes;if((Dn.position!==void 0||Dn.normal!==void 0||Dn.color!==void 0)&&N.update(V,W,Jt),(Nn||ge.receiveShadow!==V.receiveShadow)&&(ge.receiveShadow=V.receiveShadow,ot.setValue(D,"receiveShadow",V.receiveShadow)),(z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial)&&z.envMap===null&&L.environment!==null&&(_t.envMapIntensity.value=L.environmentIntensity),_t.dfgLUT!==void 0&&(_t.dfgLUT.value=jg()),Nn){if(ot.setValue(D,"toneMappingExposure",C.toneMappingExposure),ge.needsLights&&cu(_t,pi),de&&z.fog===!0&&Se.refreshFogUniforms(_t,de),Se.refreshMaterialUniforms(_t,z,Q,J,T.state.transmissionRenderTarget[y.id]),ge.needsLights&&ge.lightProbeGrid){let ut=ge.lightProbeGrid;_t.probesSH.value=ut.texture,_t.probesMin.value.copy(ut.boundingBox.min),_t.probesMax.value.copy(ut.boundingBox.max),_t.probesResolution.value.copy(ut.resolution)}Ji.upload(D,Nl(ge),_t,X)}if(z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(Ji.upload(D,Nl(ge),_t,X),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&ot.setValue(D,"center",V.center),ot.setValue(D,"modelViewMatrix",V.modelViewMatrix),ot.setValue(D,"normalMatrix",V.normalMatrix),ot.setValue(D,"modelMatrix",V.matrixWorld),z.uniformsGroups!==void 0){let ut=z.uniformsGroups;for(let Un=0,mi=ut.length;Un<mi;Un++){let Fl=ut[Un];te.update(Fl,Jt),te.bind(Fl,Jt)}}return Jt}function cu(y,L){y.ambientLightColor.needsUpdate=L,y.lightProbe.needsUpdate=L,y.sunLights.needsUpdate=L,y.sunLightShadows.needsUpdate=L,y.directionalLights.needsUpdate=L,y.directionalLightShadows.needsUpdate=L,y.pointLights.needsUpdate=L,y.pointLightShadows.needsUpdate=L,y.spotLights.needsUpdate=L,y.spotLightShadows.needsUpdate=L,y.rectAreaLights.needsUpdate=L,y.hemisphereLights.needsUpdate=L}function hu(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return G},this.getActiveMipmapLevel=function(){return q},this.getRenderTarget=function(){return ne},this.setRenderTargetTextures=function(y,L,W){let z=H.get(y);z.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),H.get(y.texture).__webglTexture=L,H.get(y.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:W,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,L){let W=H.get(y);W.__webglFramebuffer=L,W.__useDefaultFramebuffer=L===void 0},this.setRenderTarget=function(y,L=0,W=0){ne=y,G=L,q=W;let z=null,V=!1,de=!1;if(y){let ue=H.get(y);if(ue.__useDefaultFramebuffer!==void 0){g.bindFramebuffer(D.FRAMEBUFFER,ue.__webglFramebuffer),ee.copy(y.viewport),Me.copy(y.scissor),we=y.scissorTest,g.viewport(ee),g.scissor(Me),g.setScissorTest(we),Y=-1;return}else if(ue.__webglFramebuffer===void 0)X.setupRenderTarget(y);else if(ue.__hasExternalTextures)X.rebindTextures(y,H.get(y.texture).__webglTexture,H.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){let He=y.depthTexture;if(ue.__boundDepthTexture!==He){if(He!==null&&H.has(He)&&(y.width!==He.image.width||y.height!==He.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");X.setupDepthRenderbuffer(y)}}let ye=y.texture;(ye.isData3DTexture||ye.isDataArrayTexture||ye.isCompressedArrayTexture)&&(de=!0);let Te=H.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Te[L])?z=Te[L][W]:z=Te[L],V=!0):y.samples>0&&X.useMultisampledRTT(y)===!1?z=H.get(y).__webglMultisampledFramebuffer:Array.isArray(Te)?z=Te[W]:z=Te,ee.copy(y.viewport),Me.copy(y.scissor),we=y.scissorTest}else ee.copy(me).multiplyScalar(Q).floor(),Me.copy(Ve).multiplyScalar(Q).floor(),we=gt;if(W!==0&&(z=B),g.bindFramebuffer(D.FRAMEBUFFER,z)&&g.drawBuffers(y,z),g.viewport(ee),g.scissor(Me),g.setScissorTest(we),V){let ue=H.get(y.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+L,ue.__webglTexture,W)}else if(de){let ue=L;for(let ye=0;ye<y.textures.length;ye++){let Te=H.get(y.textures[ye]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+ye,Te.__webglTexture,W,ue)}}else if(y!==null&&W!==0){let ue=H.get(y.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,ue.__webglTexture,W)}Y=-1};function Ul(y){let L=H.get(y);return(L.__readFormat!==y.format||L.__readType!==y.type)&&(L.__readFormat=y.format,L.__readType=y.type,L.__formatReadable=w.textureFormatReadable(y.format),L.__typeReadable=w.textureTypeReadable(y.type)),L}this.readRenderTargetPixels=function(y,L,W,z,V,de,xe,ue=0){if(!(y&&y.isWebGLRenderTarget)){De("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=H.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&xe!==void 0&&(ye=ye[xe]),ye){g.bindFramebuffer(D.FRAMEBUFFER,ye);try{let Te=y.textures[ue],He=Te.format,Ze=Te.type;y.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+ue);let ve=Ul(Te);if(ve.__formatReadable===!1){De("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(ve.__typeReadable===!1){De("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}L>=0&&L<=y.width-z&&W>=0&&W<=y.height-V&&D.readPixels(L,W,z,V,ce.convert(He),ce.convert(Ze),de)}finally{let Te=ne!==null?H.get(ne).__webglFramebuffer:null;g.bindFramebuffer(D.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(y,L,W,z,V,de,xe,ue=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=H.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&xe!==void 0&&(ye=ye[xe]),ye)if(L>=0&&L<=y.width-z&&W>=0&&W<=y.height-V){g.bindFramebuffer(D.FRAMEBUFFER,ye);let Te=y.textures[ue],He=Te.format,Ze=Te.type;y.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+ue);let ve=Ul(Te);if(ve.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(ve.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let nt=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,nt),D.bufferData(D.PIXEL_PACK_BUFFER,de.byteLength,D.STREAM_READ),D.readPixels(L,W,z,V,ce.convert(He),ce.convert(Ze),0),D.bindBuffer(D.PIXEL_PACK_BUFFER,null);let xt=ne!==null?H.get(ne).__webglFramebuffer:null;g.bindFramebuffer(D.FRAMEBUFFER,xt);let dt=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await Xc(D,dt,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,nt),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,de),D.bindBuffer(D.PIXEL_PACK_BUFFER,null),D.deleteBuffer(nt),D.deleteSync(dt),de}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,L=null,W=0){let z=Math.pow(2,-W),V=Math.floor(y.image.width*z),de=Math.floor(y.image.height*z),xe=L!==null?L.x:0,ue=L!==null?L.y:0;X.setTexture2D(y,0),D.copyTexSubImage2D(D.TEXTURE_2D,W,0,0,xe,ue,V,de),g.unbindTexture()},this.copyTextureToTexture=function(y,L,W=null,z=null,V=0,de=0){let xe,ue,ye,Te,He,Ze,ve,nt,xt,dt=y.isCompressedTexture?y.mipmaps[de]:y.image;if(W!==null)xe=W.max.x-W.min.x,ue=W.max.y-W.min.y,ye=W.isBox3?W.max.z-W.min.z:1,Te=W.min.x,He=W.min.y,Ze=W.isBox3?W.min.z:0;else{let _t=Math.pow(2,-V);xe=Math.floor(dt.width*_t),ue=Math.floor(dt.height*_t),y.isDataArrayTexture?ye=dt.depth:y.isData3DTexture?ye=Math.floor(dt.depth*_t):ye=1,Te=0,He=0,Ze=0}z!==null?(ve=z.x,nt=z.y,xt=z.z):(ve=0,nt=0,xt=0);let lt=ce.convert(L.format),Pt=ce.convert(L.type),ge;L.isData3DTexture?(X.setTexture3D(L,0),ge=D.TEXTURE_3D):L.isDataArrayTexture||L.isCompressedArrayTexture?(X.setTexture2DArray(L,0),ge=D.TEXTURE_2D_ARRAY):(X.setTexture2D(L,0),ge=D.TEXTURE_2D),g.activeTexture(D.TEXTURE0),g.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,L.flipY),g.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),g.pixelStorei(D.UNPACK_ALIGNMENT,L.unpackAlignment);let Ut=g.getParameter(D.UNPACK_ROW_LENGTH),et=g.getParameter(D.UNPACK_IMAGE_HEIGHT),Jt=g.getParameter(D.UNPACK_SKIP_PIXELS),dn=g.getParameter(D.UNPACK_SKIP_ROWS),Nn=g.getParameter(D.UNPACK_SKIP_IMAGES);g.pixelStorei(D.UNPACK_ROW_LENGTH,dt.width),g.pixelStorei(D.UNPACK_IMAGE_HEIGHT,dt.height),g.pixelStorei(D.UNPACK_SKIP_PIXELS,Te),g.pixelStorei(D.UNPACK_SKIP_ROWS,He),g.pixelStorei(D.UNPACK_SKIP_IMAGES,Ze);let pi=y.isDataArrayTexture||y.isData3DTexture,ot=L.isDataArrayTexture||L.isData3DTexture;if(y.isDepthTexture){let _t=H.get(y),Dn=H.get(L),ut=H.get(_t.__renderTarget),Un=H.get(Dn.__renderTarget);g.bindFramebuffer(D.READ_FRAMEBUFFER,ut.__webglFramebuffer),g.bindFramebuffer(D.DRAW_FRAMEBUFFER,Un.__webglFramebuffer);for(let mi=0;mi<ye;mi++)pi&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,H.get(y).__webglTexture,V,Ze+mi),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,H.get(L).__webglTexture,de,xt+mi)),D.blitFramebuffer(Te,He,xe,ue,ve,nt,xe,ue,D.DEPTH_BUFFER_BIT,D.NEAREST);g.bindFramebuffer(D.READ_FRAMEBUFFER,null),g.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(V!==0||y.isRenderTargetTexture||H.has(y)){let _t=H.get(y),Dn=H.get(L);g.bindFramebuffer(D.READ_FRAMEBUFFER,I),g.bindFramebuffer(D.DRAW_FRAMEBUFFER,k);for(let ut=0;ut<ye;ut++)pi?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,_t.__webglTexture,V,Ze+ut):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,_t.__webglTexture,V),ot?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Dn.__webglTexture,de,xt+ut):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Dn.__webglTexture,de),V!==0?D.blitFramebuffer(Te,He,xe,ue,ve,nt,xe,ue,D.COLOR_BUFFER_BIT,D.NEAREST):ot?D.copyTexSubImage3D(ge,de,ve,nt,xt+ut,Te,He,xe,ue):D.copyTexSubImage2D(ge,de,ve,nt,Te,He,xe,ue);g.bindFramebuffer(D.READ_FRAMEBUFFER,null),g.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else ot?y.isDataTexture||y.isData3DTexture?D.texSubImage3D(ge,de,ve,nt,xt,xe,ue,ye,lt,Pt,dt.data):L.isCompressedArrayTexture?D.compressedTexSubImage3D(ge,de,ve,nt,xt,xe,ue,ye,lt,dt.data):D.texSubImage3D(ge,de,ve,nt,xt,xe,ue,ye,lt,Pt,dt):y.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,de,ve,nt,xe,ue,lt,Pt,dt.data):y.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,de,ve,nt,dt.width,dt.height,lt,dt.data):D.texSubImage2D(D.TEXTURE_2D,de,ve,nt,xe,ue,lt,Pt,dt);g.pixelStorei(D.UNPACK_ROW_LENGTH,Ut),g.pixelStorei(D.UNPACK_IMAGE_HEIGHT,et),g.pixelStorei(D.UNPACK_SKIP_PIXELS,Jt),g.pixelStorei(D.UNPACK_SKIP_ROWS,dn),g.pixelStorei(D.UNPACK_SKIP_IMAGES,Nn),de===0&&L.generateMipmaps&&D.generateMipmap(ge),g.unbindTexture()},this.initRenderTarget=function(y){H.get(y).__webglFramebuffer===void 0&&X.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?X.setTextureCube(y,0):y.isData3DTexture?X.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?X.setTexture2DArray(y,0):X.setTexture2D(y,0),g.unbindTexture()},this.resetState=function(){G=0,q=0,ne=null,g.reset(),pe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return rn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=$e._getDrawingBufferColorSpace(e),t.unpackColorSpace=$e._getUnpackColorSpace()}};var e0=[{dir:new P(-.52,.83,.08).normalize(),amp:.44,sigma:.29},{dir:new P(.54,.83,.1).normalize(),amp:.46,sigma:.3}];function t0(i){let e=1;for(let n of e0){let s=Zt.clamp(i.dot(n.dir),-1,1),r=Math.acos(s);e+=n.amp*Math.exp(-(r*r/(2*n.sigma*n.sigma)))}let t=Math.max(0,i.z);return e+=.06*t*t,e}function es(i,e){let t=t0(i);return e.set(i.x*t*1.18,i.y*t,i.z*t*1.06),e.y<0&&(e.y*=.76),e.y+=.08,e}var ka=new P,_l=new P,Qi=new P,ji=new P,Th=new P,wh=new P,Ah=new P,Rh=new P,xl=new P;function Ch(i,e){xl.set(0,1,0),Math.abs(i.y)>.9&&xl.set(1,0,0),ka.crossVectors(i,xl).normalize(),_l.crossVectors(i,ka).normalize();let t=.012;return Qi.copy(i).addScaledVector(ka,t).normalize(),ji.copy(i).addScaledVector(ka,-t).normalize(),es(Qi,Th),es(ji,wh),Qi.copy(i).addScaledVector(_l,t).normalize(),ji.copy(i).addScaledVector(_l,-t).normalize(),es(Qi,Ah),es(ji,Rh),Qi.subVectors(wh,Th),ji.subVectors(Rh,Ah),e.crossVectors(Qi,ji).normalize(),e.dot(i)<0&&e.negate(),e}var Ga={eyeL:new P(-.45,.03,.89).normalize(),eyeR:new P(.45,.03,.89).normalize(),nose:new P(0,-.1,1).normalize()};var Gh={mochi:"Chat",dragon:"Dragon",lapin:"Lapin",fantome:"Fant\xF4me",renard:"Renard",ours:"Ours",grenouille:"Grenouille",licorne:"Licorne",hibou:"Hibou",pingouin:"Pingouin"},Pn=Zt.smoothstep,Ee=(i,e,t)=>new P(i,e,t).normalize();function In(i,e){return(t,n)=>{let s=i(t);return n.set(t.x*s*e.sx,t.y*s*e.sy,t.z*s*e.sz),n.y<0&&(n.y*=e.flatten),n.y+=.08,n}}var Wa=new P,yl=new P,ts=new P,ns=new P,Ph=new P,Ih=new P,Lh=new P,Nh=new P,vl=new P;function Ln(i){return(e,t)=>{vl.set(0,1,0),Math.abs(e.y)>.9&&vl.set(1,0,0),Wa.crossVectors(e,vl).normalize(),yl.crossVectors(e,Wa).normalize();let n=.012;return ts.copy(e).addScaledVector(Wa,n).normalize(),ns.copy(e).addScaledVector(Wa,-n).normalize(),i(ts,Ph),i(ns,Ih),ts.copy(e).addScaledVector(yl,n).normalize(),ns.copy(e).addScaledVector(yl,-n).normalize(),i(ts,Lh),i(ns,Nh),ts.subVectors(Ih,Ph),ns.subVectors(Nh,Lh),t.crossVectors(ts,ns).normalize(),t.dot(e)<0&&t.negate(),t}}var n0={shape:"mochi",surfacePoint:es,surfaceNormal:Ch,face:{eyeL:Ga.eyeL,eyeR:Ga.eyeR,nose:Ga.nose,eyeScale:.125,noseColor:"#ff9fc2"},ears:[],snout:void 0,ghost:void 0,furBoost:[]};function i0(i){let e=1.02;e*=1+.22*Math.exp(-((i.y+.05)**2/.3));let t=Pn(i.y,-.2,.45);return e*=.72+.2*t,i.y<-.25&&(e*=.8),e*=1-.06*Math.abs(i.x*i.z),i.z>.5&&(e+=.16*Math.exp(-((i.x*i.x+(i.y+.05)**2)/.1))),e}var Dh=In(i0,{sx:1.22,sy:.92,sz:1.12,flatten:.8}),s0={shape:"dragon",surfacePoint:Dh,surfaceNormal:Ln(Dh),face:{eyeL:Ee(-.3,.29,.9),eyeR:Ee(.3,.29,.9),nose:Ee(0,.1,1),eyeScale:.105,noseColor:"#2f2126"},ears:[{dir:Ee(-.42,.8,-.05),type:"cone",h:.72,r:.13,tilt:.42,color:"#efdfc4"},{dir:Ee(.42,.8,-.05),type:"cone",h:.72,r:.13,tilt:.42,color:"#efdfc4"}],snout:{dir:Ee(0,-.02,1),scale:[.24,.13,.16],color:"#8f2f1c"},furBoost:[{dir:Ee(-.42,.8,-.05),sigma:.35,boost:.5},{dir:Ee(.42,.8,-.05),sigma:.35,boost:.5},{dir:Ee(0,0,1),sigma:.4,boost:.35}]};function r0(i){let e=1;e*=1+.15*Math.exp(-((i.y-.05)**2/.4));let t=Pn(i.y,-.18,.5);return e*=.7+.26*t,i.y<-.2&&(e*=.72),e*=1-.05*Math.abs(i.z),e}var Uh=In(r0,{sx:1.05,sy:1.18,sz:1,flatten:.72}),a0={shape:"lapin",surfacePoint:Uh,surfaceNormal:Ln(Uh),face:{eyeL:Ee(-.23,.33,.92),eyeR:Ee(.23,.33,.92),nose:Ee(0,.16,.98),eyeScale:.115,noseColor:"#ff9fc2"},ears:[{dir:Ee(-.24,.92,0),type:"capsule",h:.85,r:.13,tilt:.12,color:"#dcc8ec"},{dir:Ee(.24,.92,0),type:"capsule",h:.85,r:.13,tilt:.12,color:"#dcc8ec"}],furBoost:[{dir:Ee(-.24,.92,0),sigma:.3,boost:.9},{dir:Ee(.24,.92,0),sigma:.3,boost:.9}]};function o0(i){let e=.95,t=Pn(i.y,-.25,.4);if(e*=.75+.25*t,i.y<0){let n=Math.atan2(i.z,i.x);e+=.13*Math.exp(-((i.y+.55)**2/.25))*(.5+.5*Math.sin(n*6+1.2))}return e}var Fh=In(o0,{sx:1.05,sy:1.05,sz:1,flatten:1}),l0={shape:"fantome",surfacePoint:Fh,surfaceNormal:Ln(Fh),face:{eyeL:Ee(-.22,.34,.91),eyeR:Ee(.22,.34,.91),nose:Ee(0,.1,.99),eyeScale:.135,noseColor:"#7fa8d9"},ears:[],ghost:{opacity:.94,floatAmp:.07,emissive:"#9cc2ff"},furBoost:[]};function c0(i){let e=1;e*=1+.1*Math.exp(-((i.y-.05)**2/.4));let t=Pn(i.y,-.18,.5);return e*=.76+.22*t,i.y<-.2&&(e*=.78),i.z>.55&&(e+=.06*Math.exp(-((i.y+.02)**2/.12))),e}var Oh=In(c0,{sx:.98,sy:1.02,sz:1.02,flatten:.78}),h0={shape:"renard",surfacePoint:Oh,surfaceNormal:Ln(Oh),face:{eyeL:Ee(-.24,.34,.92),eyeR:Ee(.24,.34,.92),nose:Ee(0,.14,1),eyeScale:.115,noseColor:"#2f2126"},ears:[{dir:Ee(-.38,.86,-.05),type:"cone",h:.85,r:.16,tilt:.35,color:"#2f2126"},{dir:Ee(.38,.86,-.05),type:"cone",h:.85,r:.16,tilt:.35,color:"#2f2126"}],snout:{dir:Ee(0,-.02,1),scale:[.2,.14,.32],color:"#f5efe6",fixedColor:!0},furBoost:[{dir:Ee(-.38,.86,-.05),sigma:.35,boost:.6},{dir:Ee(.38,.86,-.05),sigma:.35,boost:.6},{dir:Ee(0,0,1),sigma:.35,boost:.2}]};function u0(i){let e=1.04;e*=1+.16*Math.exp(-((i.y+.08)**2/.34));let t=Pn(i.y,-.2,.45);return e*=.78+.18*t,i.y<-.25&&(e*=.82),e}var Bh=In(u0,{sx:1.14,sy:.98,sz:1.08,flatten:.8}),d0={shape:"ours",surfacePoint:Bh,surfaceNormal:Ln(Bh),face:{eyeL:Ee(-.26,.3,.93),eyeR:Ee(.26,.3,.93),nose:Ee(0,.12,1),eyeScale:.1,noseColor:"#2f2126"},ears:[{dir:Ee(-.42,.82,-.05),type:"capsule",h:.28,r:.22,tilt:.25,color:"#2f2126"},{dir:Ee(.42,.82,-.05),type:"capsule",h:.28,r:.22,tilt:.25,color:"#2f2126"}],snout:{dir:Ee(0,-.02,1),scale:[.22,.16,.16],color:"#f5efe6",fixedColor:!0},furBoost:[{dir:Ee(-.42,.82,-.05),sigma:.35,boost:.3},{dir:Ee(.42,.82,-.05),sigma:.35,boost:.3}]};function f0(i){let e=1,t=Pn(i.y,-.3,.3);return e*=.82+.18*t,e*=1+.06*Math.exp(-((i.y+.05)**2/.2))*(1-Math.abs(i.z)),e}var zh=In(f0,{sx:1.25,sy:.78,sz:1.08,flatten:.72}),p0={shape:"grenouille",surfacePoint:zh,surfaceNormal:Ln(zh),face:{eyeL:Ee(-.34,.52,.82),eyeR:Ee(.34,.52,.82),nose:Ee(0,.2,1),eyeScale:.17,noseColor:"#3a5a1a"},ears:[],snout:{dir:Ee(0,-.05,1),scale:[.34,.05,.1],color:"#1a3a1a",fixedColor:!0},furBoost:[]};function m0(i){let e=1;e*=1+.08*Math.exp(-((i.y-.05)**2/.4));let t=Pn(i.y,-.2,.5);return e*=.7+.26*t,i.y<-.2&&(e*=.72),e*=1-.04*Math.abs(i.z),e}var Vh=In(m0,{sx:.94,sy:1.22,sz:.96,flatten:.72}),g0={shape:"licorne",surfacePoint:Vh,surfaceNormal:Ln(Vh),face:{eyeL:Ee(-.22,.34,.93),eyeR:Ee(.22,.34,.93),nose:Ee(0,.12,1),eyeScale:.11,noseColor:"#8a5a3a"},ears:[{dir:Ee(-.22,.94,0),type:"capsule",h:.35,r:.09,tilt:.1,color:"#dcc8ec"},{dir:Ee(.22,.94,0),type:"capsule",h:.35,r:.09,tilt:.1,color:"#dcc8ec"},{dir:Ee(0,.85,.45),type:"cone",h:.8,r:.09,tilt:0,color:"#ffd76b",fixedColor:!0}],snout:{dir:Ee(0,-.02,1),scale:[.18,.13,.28],color:"#e8d5c0",fixedColor:!0},furBoost:[{dir:Ee(0,.5,-.6),sigma:.4,boost:.5}]};function _0(i){let e=1;e*=1+.12*Math.exp(-((i.y-.05)**2/.4));let t=Pn(i.y,-.2,.5);return e*=.76+.22*t,i.y<-.2&&(e*=.8),e}var Hh=In(_0,{sx:1.12,sy:1.05,sz:1.06,flatten:.82}),x0={shape:"hibou",surfacePoint:Hh,surfaceNormal:Ln(Hh),face:{eyeL:Ee(-.3,.36,.9),eyeR:Ee(.3,.36,.9),nose:Ee(0,.14,1),eyeScale:.17,noseColor:"#e0a83a"},ears:[{dir:Ee(-.38,.88,-.05),type:"cone",h:.45,r:.1,tilt:.35,color:"#e0a83a"},{dir:Ee(.38,.88,-.05),type:"cone",h:.45,r:.1,tilt:.35,color:"#e0a83a"}],snout:{dir:Ee(0,.08,1),scale:[.07,.11,.12],color:"#e0a83a",fixedColor:!0},furBoost:[]};function y0(i){let e=1,t=Pn(i.y,-.2,.5);return e*=.78+.22*t,i.y<-.2&&(e*=.8),i.z>.3&&(e+=.04*Math.exp(-((i.y+.05)**2/.3))),e}var kh=In(y0,{sx:.92,sy:1.25,sz:.98,flatten:.75}),v0={shape:"pingouin",surfacePoint:kh,surfaceNormal:Ln(kh),face:{eyeL:Ee(-.2,.34,.94),eyeR:Ee(.2,.34,.94),nose:Ee(0,.14,1),eyeScale:.11,noseColor:"#e08a3a"},ears:[{dir:Ee(-.85,.05,0),type:"capsule",h:.55,r:.12,tilt:.9,color:"#e08a3a"},{dir:Ee(.85,.05,0),type:"capsule",h:.55,r:.12,tilt:.9,color:"#e08a3a"}],snout:{dir:Ee(0,.05,1),scale:[.09,.09,.16],color:"#e08a3a",fixedColor:!0},furBoost:[]},Ml={mochi:n0,dragon:s0,lapin:a0,fantome:l0,renard:h0,ours:d0,grenouille:p0,licorne:g0,hibou:x0,pingouin:v0};function Wh(i,e){let t=e.preset;return{...i,shape:e.shape,preset:t,ears:i.ears.map(n=>({...n,dir:n.dir.clone(),color:n.fixedColor?n.color:t.tip})),snout:i.snout?{...i.snout,dir:i.snout.dir.clone(),color:i.snout.fixedColor?i.snout.color:t.root}:void 0,ghost:i.ghost?{...i.ghost,emissive:t.glow}:void 0,furBoost:i.furBoost.map(n=>({...n,dir:n.dir.clone()}))}}var Xa={commune:0,rare:1,epique:2,legendaire:3,mythique:4};function Xh(i){return ss[Xa[i]].color}function qh(i){return ss[Xa[i]].name}var Gs=[{id:"noisette",label:"Noisette",color:"#231a2b",rarity:"commune",w:52},{id:"ciel",label:"Bleu ciel",color:"#4ea3ff",rarity:"rare",w:18},{id:"emeraude",label:"\xC9meraude",color:"#2fd6a4",rarity:"rare",w:14},{id:"amethyste",label:"Am\xE9thyste",color:"#b26bff",glow:!0,rarity:"epique",w:8},{id:"solaire",label:"Or solaire",color:"#ffb020",glow:!0,rarity:"epique",w:5},{id:"braise",label:"Braise",color:"#ff7a3d",glow:!0,rarity:"legendaire",w:2.2},{id:"prisme",label:"Prisme",color:"#ff5fd8",color2:"#35e6ff",glow:!0,rarity:"mythique",w:.8}],qa=[{id:"nature",label:"Nature",rarity:"commune",w:55},{id:"doree",label:"Pointe dor\xE9e",tip:"#ffd166",rarity:"rare",w:24},{id:"panache",label:"Panach\xE9",twoTone:!0,rarity:"epique",w:15},{id:"nacree",label:"Nacr\xE9e",tip:"#ffeef8",rarity:"legendaire",w:4.5},{id:"galaxie",label:"Galaxie",tip:"#ffffff",rainbow:!0,rarity:"mythique",w:1.5}],Ya=[{id:"naturelle",label:"Naturelle",kind:"nature",rarity:"commune",w:87},{id:"albinos",label:"Albinos",kind:"albinos",rarity:"rare",w:9},{id:"charbon",label:"Charbon",kind:"charbon",rarity:"epique",w:4}];function Yh(){return{eye:Gs[0],fur:qa[0],tint:Ya[0],hetero:null}}function Sl(i){let e=0;for(let n of i)e+=n.w;let t=Math.random()*e;for(let n of i)if(t-=n.w,t<=0)return n;return i[i.length-1]}function Zh(){let i=Sl(Gs),e=Sl(qa),t=Sl(Ya),n=null;if(Math.random()<.1){let s=Gs.filter(r=>r.id!==i.id);n=s[Math.floor(Math.random()*s.length)]}return{eye:i,fur:e,tint:t,hetero:n}}function Jh(i){let e="commune",t=[i.eye.rarity,i.fur.rarity,i.tint.rarity];i.hetero&&t.push("rare");for(let n of t)Xa[n]>Xa[e]&&(e=n);return e}function M0(i){return i.eye.id==="noisette"&&i.fur.id==="nature"&&i.tint.kind==="nature"&&!i.hetero}function $h(i){if(!i||M0(i))return"none";let e="eye:"+i.eye.id+"|fur:"+i.fur.id+"|tint:"+i.tint.id;return i.hetero&&(e+="|hetero:"+i.hetero.id),e}function Kh(i,e,t){let n=parseInt(i.slice(1),16),s=parseInt(e.slice(1),16),r=Math.round((n>>16&255)*(1-t)+(s>>16&255)*t),a=Math.round((n>>8&255)*(1-t)+(s>>8&255)*t),o=Math.round((n&255)*(1-t)+(s&255)*t);return"#"+(r<<16|a<<8|o).toString(16).padStart(6,"0")}var bl={baseStrands:3e3,furLength:.62,furDensity:1},El={baseStrands:1200,furLength:.58,furDensity:1},S0=new P(0,1,0);function Qh(i,e,t,n){let s=new Wt,r=Object.assign({baseStrands:4e3,furLength:null,furDensity:null},n||{}),a=r.baseStrands,o=Zt.clamp(r.furLength??i.furLength??.62,.55,1.7),c=Zt.clamp(r.furDensity??1,.3,1),l=Math.floor(a*(i.countMul??1)),u=new P,d=new P,h=new P,m=new P,x=new P,S=new P,p=i.face,f=p.eyeL,M=p.eyeR,A=p.nose,v=new on(1,110,78),b=v.attributes.position;for(let fe=0;fe<b.count;fe++)u.set(b.getX(fe),b.getY(fe),b.getZ(fe)).normalize(),i.surfacePoint(u,d),b.setXYZ(fe,d.x,d.y,d.z);v.computeVertexNormals();let T=new Pe(e.root),R=new Pe(e.tip),_=new Pe(e.body??e.root).multiplyScalar(.96),E=e.hueShift??0,C=0;t&&(t.fur.tip&&R.set(t.fur.tip),t.fur.rainbow&&(R.set(t.fur.tip??"#ffffff"),E=Math.max(E,1)),t.fur.twoTone&&(C=1),t.tint.kind==="albinos"?(T.lerp(new Pe("#f7f2fa"),.6),R.lerp(new Pe("#ffffff"),.75),_.lerp(new Pe("#f2ecf6"),.8)):t.tint.kind==="charbon"&&(T.lerp(new Pe("#1c141e"),.6),R.lerp(new Pe("#5a4660"),.5),_.lerp(new Pe("#241b28"),.75)));let U=new Xt({color:_,roughness:.95,metalness:0}),F=new rt(v,U);s.add(F);let B=new Float32Array(l*3),I=new Float32Array(l*3),k=new Float32Array(l),G=new Float32Array(l*18);for(let fe=0;fe<l;fe++){let Re=Math.random()*2-1,Be=Math.random()*Math.PI*2,Ye=Math.sqrt(Math.max(0,1-Re*Re));u.set(Ye*Math.cos(Be),Re,Ye*Math.sin(Be)),i.surfacePoint(u,d),i.surfaceNormal(u,h),m.set(Math.random()*2-1,Math.random()*2-1,Math.random()*2-1),x.crossVectors(h,m).normalize(),S.copy(h).addScaledVector(x,(Math.random()-.5)*.55).addScaledVector(S0,.1).normalize();let Qe=.13+.11*Math.pow(Math.random(),1.5);Math.random()<.07&&(Qe+=.06+Math.random()*.05),Qe*=i.lenMul??1;for(let ae of i.furBoost??[]){let oe=u.angleTo(ae.dir);Qe*=1+ae.boost*Math.exp(-(oe*oe/(2*ae.sigma*ae.sigma)))}let Xe=u.angleTo(f),ct=u.angleTo(M),D=u.angleTo(A),vt=Math.min(Xe,ct,D);vt<.38&&(Qe*=.5+.5*Zt.smoothstep(vt,.08,.38)),Qe*=o;let Je=fe*3;B[Je]=d.x,B[Je+1]=d.y,B[Je+2]=d.z,I[Je]=S.x,I[Je+1]=S.y,I[Je+2]=S.z,k[fe]=Qe;let w=fe*18,g=(.011+Math.random()*.008)*(i.widthMul??1.1),O=x.x,H=x.y,X=x.z,ie=h.y*X-h.z*H,se=h.z*O-h.x*X,Z=h.x*H-h.y*O;G[w]=d.x+ie*g,G[w+1]=d.y+se*g,G[w+2]=d.z+Z*g,G[w+3]=d.x-ie*g,G[w+4]=d.y-se*g,G[w+5]=d.z-Z*g;let $=d.x+S.x*Qe,re=d.y+S.y*Qe,Se=d.z+S.z*Qe;G[w+6]=$,G[w+7]=re,G[w+8]=Se,G[w+9]=d.x+O*g,G[w+10]=d.y+H*g,G[w+11]=d.z+X*g,G[w+12]=d.x-O*g,G[w+13]=d.y-H*g,G[w+14]=d.z-X*g,G[w+15]=$,G[w+16]=re,G[w+17]=Se}let q=new At,ne=new Tt(G,3);ne.setUsage(Zo),q.setAttribute("position",ne);let Y=new Float32Array(l*18),j=new Float32Array(l*6),ee=new Float32Array(l*6),Me=new Uint32Array(l*6);for(let fe=0;fe<l;fe++){let Re=fe*3,Be=fe*18;for(let Xe=0;Xe<6;Xe++)Y[Be+Xe*3]=I[Re],Y[Be+Xe*3+1]=I[Re+1],Y[Be+Xe*3+2]=I[Re+2],j[fe*6+Xe]=Xe===2||Xe===5?1:0,ee[fe*6+Xe]=Math.random();let Ye=fe*6,Qe=fe*6;Me[Ye]=Qe,Me[Ye+1]=Qe+1,Me[Ye+2]=Qe+2,Me[Ye+3]=Qe+3,Me[Ye+4]=Qe+4,Me[Ye+5]=Qe+5}q.setAttribute("aNormal",new Tt(Y,3)),q.setAttribute("aT",new Tt(j,1)),q.setAttribute("aRand",new Tt(ee,1)),q.setIndex(new Tt(Me,1)),q.setDrawRange(0,Math.floor(l*c)*6);let we=new Bt({side:Kt,uniforms:{uRoot:{value:T},uTip:{value:R},uLightDir:{value:new P(2.4,3.2,3.6).normalize()},uRimColor:{value:new Pe("#ff5ad5")},uHueShift:{value:E},uTwoTone:{value:C}},vertexShader:`
      attribute vec3 aNormal;
      attribute float aT;
      attribute float aRand;
      varying float vT;
      varying float vRand;
      varying vec3 vN;
      void main() {
        vT = aT;
        vRand = aRand;
        vN = normalize(normalMatrix * aNormal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform vec3 uRoot;
      uniform vec3 uTip;
      uniform vec3 uLightDir;
      uniform vec3 uRimColor;
      uniform float uHueShift;
      uniform float uTwoTone;
      varying float vT;
      varying float vRand;
      varying vec3 vN;

      vec3 hueRotate(vec3 c, float a) {
        const vec3 k = vec3(0.57735);
        float ca = cos(a);
        return c * ca + cross(k, c) * sin(a) + k * dot(k, c) * (1.0 - ca);
      }

      void main() {
        vec3 N = normalize(vN);
        vec3 L = normalize(uLightDir);
        float diff = max(dot(N, L), 0.0);
        float rim = pow(1.0 - max(dot(N, vec3(0.0, 0.0, 1.0)), 0.0), 2.2);
        float grad = vT * (0.55 + 0.45 * vT);
        vec3 col = mix(uRoot, uTip, grad);
        col *= 0.55 + 0.62 * diff;
        col += uRimColor * rim * (0.10 + 0.22 * vT);
        col *= 0.88 + 0.24 * vRand;
        col *= mix(0.62, 1.0, smoothstep(0.0, 0.3, vT));
        if (uHueShift > 0.0) {
          float ang = uHueShift * mix(0.5, 6.2831, vRand) * smoothstep(0.12, 0.85, vT);
          col = hueRotate(col, ang);
        }
        if (uTwoTone > 0.5 && vRand > 0.62) {
          col = hueRotate(col, 2.5);
          col *= vec3(0.92, 1.05, 1.04);
        }
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }
    `}),at=new rt(q,we);at.frustumCulled=!1,s.add(at);let ze=new Wt,je=new on(1,28,22),J=new Xt({color:657936,roughness:.16,metalness:.08}),Q=[],_e=[f,M];for(let fe of _e){i.surfacePoint(fe,d),i.surfaceNormal(fe,h);let Re=J.clone();Q.push(Re);let Be=new rt(je,Re);Be.scale.setScalar(p.eyeScale),Be.position.copy(d).addScaledVector(h,.03),ze.add(Be);let Ye=new on(1,12,10),Qe=new an({color:16777215}),Xe=new rt(Ye,Qe);Xe.scale.setScalar(.03),Xe.position.copy(Be.position).addScaledVector(new P(.45,.5,.74).normalize(),.115),ze.add(Xe);let ct=new rt(Ye,Qe.clone());ct.scale.setScalar(.014),ct.position.copy(Be.position).addScaledVector(new P(.72,-.2,.66).normalize(),.118),ze.add(ct)}let Ue=t?.eye.color??"#0a0a10",me=t?.eye.glow??!1,Ve=t?.hetero?.color??t?.eye.color2??Ue,gt=(fe,Re,Be)=>{fe.color.set(Re),Be?(fe.emissive.set(Re),fe.emissiveIntensity=.55):(fe.emissive.set(0),fe.emissiveIntensity=0)};Q[0]&&gt(Q[0],Ue,me),Q[1]&&gt(Q[1],Ve,me),i.surfacePoint(A,d),i.surfaceNormal(A,h),u.copy(h);let We=new Xt({color:new Pe(p.noseColor),roughness:.4,metalness:0}),qe=new rt(new on(1,16,14),We);qe.scale.set(.048,.034,.026),qe.position.copy(d).addScaledVector(h,.02),qe.quaternion.setFromUnitVectors(new P(0,0,1),u),ze.add(qe),s.add(ze);for(let fe of i.ears??[]){i.surfacePoint(fe.dir,d),i.surfaceNormal(fe.dir,h);let Re=fe.type==="cone"?new Es(fe.r,fe.h,24):new Ss(fe.r,fe.h,6,18),Be=new Xt({color:new Pe(fe.color),roughness:.92,metalness:0}),Ye=new rt(Re,Be);Ye.position.copy(d).addScaledVector(h,.02),Ye.position.y+=fe.h*.42,Ye.rotation.z=-Math.sign(fe.dir.x)*fe.tilt,Ye.rotation.x=-.08,s.add(Ye)}if(i.snout){i.surfacePoint(i.snout.dir,d),i.surfaceNormal(i.snout.dir,h);let fe=new Xt({color:new Pe(i.snout.color),roughness:.88,metalness:0}),Re=new rt(new on(1,24,18),fe);Re.scale.set(i.snout.scale[0],i.snout.scale[1],i.snout.scale[2]),Re.position.copy(d).addScaledVector(h,.03),s.add(Re)}return i.ghost&&b0(F,i.ghost),s}function b0(i,e){let t=i.material;t.transparent=!0,t.opacity=e.opacity,t.emissive=new Pe(e.emissive),t.emissiveIntensity=.1}function E0(i){let e=Ml[i.shape]??Ml.mochi,t=i.preset,n=Bl[i.shape],s=Wh(e,{shape:i.shape,preset:t});return s.countMul=n.countMul,s.lenMul=n.lenMul,s.widthMul=n.widthMul,s.furLength=n.length,s.furDensity=n.density,s.windMul=n.wind,s.camDistMul=zl[i.shape],s}var jh=new Map;function eu(i){let e=jh.get(i.id);return e||(e=E0(i),jh.set(i.id,e)),e}var Ws=null,is=!0;function tu(){return is}function T0(){if(!Ws&&is)try{let i=document.createElement("canvas");Ws=new $i({canvas:i,alpha:!0,antialias:!0,preserveDrawingBuffer:!0,powerPreference:"high-performance"}),Ws.outputColorSpace=Rt,Ws.toneMapping=Yt}catch{return is=!1,null}return Ws}try{document.createElement("canvas").getContext("webgl2")||document.createElement("canvas").getContext("webgl")||(is=!1)}catch{is=!1}function w0(i){i.traverse(e=>{e instanceof rt&&(e.geometry.dispose(),Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())}),i.clear()}function A0(i){i.add(new li(16777215,2758712,1.25));let e=new Zn(16777215,1.1);e.position.set(2.5,4,4.5),i.add(e);let t=new Zn(16770815,.55);t.position.set(-3,1.5,2.5),i.add(t);let n=new ci(16773852,1.4,12);n.position.set(0,1.2,4),i.add(n)}function wl(i,e,t,n){let s=n||{},r=i._mmW||i.width,a=i._mmH||i.height,o=s.dpr||Math.min(window.devicePixelRatio||1,2),c=Math.round(r*o),l=Math.round(a*o);i.width=c,i.height=l,i.style.width===""&&(i.style.width="100%",i.style.height="100%");let u=T0();if(!u)return!1;let d=new ai;A0(d);let h=s.strands||(r<=200?El.baseStrands:bl.baseStrands),m=s.furLength||(r<=200?El.furLength:bl.furLength),x=Qh(eu(e),e.preset,t||null,{baseStrands:h,furLength:m,furDensity:1});d.add(x);let S=new Mt(40,r/a,.1,40),p=new xn().setFromObject(x),f=p.getSize(new P),M=p.getCenter(new P),A=Zt.degToRad(S.fov),v=2*Math.atan(Math.tan(A/2)*S.aspect),b=Math.max(f.y/2/Math.tan(A/2),f.x/2/Math.tan(v/2),f.z*1.1),T=(s.distMul||1)*(eu(e).camDistMul||1);S.position.set(0,M.y,M.z+b*1.18*T),S.lookAt(0,M.y,M.z),u.setPixelRatio(o),u.setSize(r,a,!1),u.render(d,S);let R=i.getContext("2d");return R&&(R.clearRect(0,0,i.width,i.height),R.drawImage(u.domElement,0,0,i.width,i.height)),w0(d),!0}var Xs=[],Tl=!1;function Za(i,e,t,n){if(i._mmPending={entry:e,mutation:t,opts:n},Xs.indexOf(i)===-1&&Xs.push(i),Tl)return;Tl=!0;function s(){let r=performance.now();for(;Xs.length&&performance.now()-r<14;){let a=Xs.shift(),o=a._mmPending;delete a._mmPending,a.isConnected&&wl(a,o.entry,o.mutation,o.opts)}Xs.length?requestAnimationFrame(s):Tl=!1}requestAnimationFrame(s)}function nu(i,e,t,n){let s=n||{};if(i._mmW=i.clientWidth||s.w||i.width,i._mmH=i.clientHeight||s.h||i.height,!("IntersectionObserver"in window)||!is){Za(i,e,t,n);return}let r=new IntersectionObserver(a=>{a.forEach(o=>{o.isIntersecting&&(r.disconnect(),Za(i,e,t,n))})},{rootMargin:"220px"});r.observe(i)}function R0(i,e,t,n){let s=n/3,r=new Wn(i,e,t,Math.min(60,Math.ceil(i/s)),Math.min(60,Math.ceil(e/s)),Math.min(60,Math.ceil(t/s))),a=r.attributes.position,o=r.attributes.normal,c=new P(i/2-n,e/2-n,t/2-n),l=new P,u=new P,d=Zt.clamp;for(let h=0;h<a.count;h++)l.fromBufferAttribute(a,h),u.set(d(l.x,-c.x,c.x),d(l.y,-c.y,c.y),d(l.z,-c.z,c.z)),l.sub(u),l.lengthSq()>0&&(l.normalize(),o.setXYZ(h,l.x,l.y,l.z),u.addScaledVector(l,n)),a.setXYZ(h,u.x,u.y,u.z);return r}function C0(i=128){let e=document.createElement("canvas");e.width=e.height=i;let t=e.getContext("2d"),n=t.createRadialGradient(i/2,i/2,0,i/2,i/2,i/2);return n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.25,"rgba(255,255,255,0.55)"),n.addColorStop(.6,"rgba(255,255,255,0.14)"),n.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=n,t.fillRect(0,0,i,i),new vs(e)}function P0(i){let e=new Wt,t=new Wt;t.position.set(0,1.12,-.8);let n=new Xt({color:4924080,roughness:.32,metalness:.25}),s=new Xt({color:16766814,roughness:.2,metalness:1,envMapIntensity:3}),r=new Xt({color:16777215,emissive:16777215,emissiveIntensity:1.5,roughness:.1}),a=new an({color:16777215}),o=new an({color:16777215,transparent:!0,opacity:.95,blending:Gi,depthWrite:!1}),c=(h,m,x,S,p,f,M,A,v)=>{let b=new rt(R0(m,x,S,p),v);return b.position.set(f,M,A),h.add(b),b};c(e,1.9,1.1,1.5,.12,0,.55,0,n),c(e,2.02,.16,1.62,.07,0,.08,0,s);for(let h of[-.55,.55])c(e,.26,1.16,1.56,.05,h,.57,0,s);c(e,1.94,.05,1.54,.02,0,1.09,0,a);let l=new rt(new bs(.8,48),o);l.rotation.x=-Math.PI/2,l.position.y=1.11,e.add(l),e.add(t),c(t,2,.4,1.6,.14,0,.2,.8,n);for(let h of[-.55,.55])c(t,.28,.44,1.64,.06,h,.2,.8,s);for(let h of[-.88,.88])for(let m of[.16,1.44]){let x=new rt(new on(.09,16,12),s);x.position.set(h,.4,m),t.add(x)}let u=new rt(new ws(.2,.045,12,32),s);u.position.set(0,.2,1.62),t.add(u);let d=new rt(new Ts(.16,0),r);return d.scale.set(1,1.3,.8),d.position.set(0,.2,1.65),t.add(d),i>0&&(t.rotation.x=-1.35*i),e}function iu(i,e,t){let n=t||{},s=i._mmW||i.clientWidth||i.width,r=i._mmH||i.clientHeight||i.height,a=n.dpr||Math.min(window.devicePixelRatio||1,2);i.width=Math.round(s*a),i.height=Math.round(r*a);let o=new $i({alpha:!0,antialias:!0,preserveDrawingBuffer:!0});o.outputColorSpace=Rt,o.setPixelRatio(a),o.setSize(s,r,!1);let c=new ai;c.add(new li(13482239,1707315,.95));let l=new Zn(16777215,1.1);l.position.set(3,6,5),c.add(l);let u=new ci(16773336,1.2,12);u.position.set(0,3.4,3.2),c.add(u);let d=new an({map:C0(),color:16777215,transparent:!0,opacity:.4,blending:Gi,depthWrite:!1}),h=new rt(new oi(7.5,7.5),d);h.rotation.x=-Math.PI/2,h.position.y=.02,c.add(h);let m=P0(e??0);c.add(m);let x=new Mt(40,s/r,.1,60);x.position.set(0,2.15,4),x.lookAt(0,.72,0),o.render(c,x);let S=i.getContext("2d");S&&(S.clearRect(0,0,i.width,i.height),S.drawImage(o.domElement,0,0,i.width,i.height)),o.dispose(),c.traverse(p=>{p.geometry&&p.geometry.dispose(),p.material&&(Array.isArray(p.material)?p.material.forEach(f=>f.dispose()):p.material.dispose())})}var I0={RARITIES:ss,POOL:Ol,HUB_PLUSHES:Vl,SHAPE_LABELS:Gh,EYES:Gs,FUR:qa,TINTS:Ya,rollMutation:Zh,mutationRarity:Jh,mutationKey:$h,defaultMutation:Yh,mixHex:Kh,rarityColor:Xh,rarityName:qh,renderPlush:wl,renderPlushQueued:Za,watchCanvas:nu,renderChest:iu,webglOK:tu()};window.MM3D=I0;})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
