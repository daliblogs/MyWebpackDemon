import "./css/index.css";
// import './css/black.less';
import './index.html';
import "./js/index.js";
let jspangString = 'Hello Webpack'
document.getElementById('title').innerHTML=jspangString;
console.log( encodeURIComponent(process.env.NODE_ENV),'env' );