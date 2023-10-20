import { useState } from "react";
import Login from "../Login/Login";
import Home from "../home/Home";


// La función para parsear el token JWT
function parseJwt(token) {
    // Divide el token en sus partes y toma la segunda parte (la carga útil JSON)
  const base64Url = token.split('.')[1];
  // Reemplaza caracteres especiales en la base64 codificada
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  // Decodifica la base64 y convierte los caracteres en formato JSON
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

 // Devuelve la carga útil JSON como un objeto
  return JSON.parse(jsonPayload);
}

// Verificar si el token es válido y existe
let tokenExistAndStillValid = false;
const storedToken = localStorage.getItem('token');
if (storedToken) {
    // Comprueba si el token existe en el almacenamiento local y si no ha expirado
  tokenExistAndStillValid = parseJwt(storedToken).exp * 1000 > Date.now();
}

const Main = () => {
      // Usa el valor de isLoggedIn para determinar si el usuario está autenticado
  const [isLoggedIn, setIsLoggedIn] = useState(tokenExistAndStillValid);

  return (
    <div>
      {isLoggedIn ? <Home /> : <Login onLogin={() => setIsLoggedIn(true)} />}
    </div>
  );
}

export default Main;


