import { useState } from "react";
import Home from "../home/Home";

const Login = () => {

    //variables de estado dónde se almacena el username y password
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loginSuccessful, setLoginSuccessful] = useState(false);
    const [error, setError] = useState(null);

    //se crea la constante y se toma "e" como argumento, esta función se ejecuta cuando se envía el formulario
    const handleLogin = (e) => {
    // evita la actualización de la página de manera determinada 
        e.preventDefault();
        // se crea el objeto llamado data que contiene las variables de estado
        const data = {
            username: username,
            password: password
        };
 //fetch. -  realiza la solicitud Post a la ruta
        fetch('http://localhost:3000/auth/login', {
 // se configura los encabezados donde se indica que se está enviando un objeto Json       
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
// se envía el objeto data como un json serializado en el cuerpo de la solicitud
// JSON.stringify. -  convierte un objeto JavaScript en una cadena de texto en formato JSON
            body: JSON.stringify(data),
        })
//maneja la respuesta con the, si la respuesta es exitosa se analiza la respuesta como Json
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
// maneja el resultado de la respuesta exitosa
// si el resultado tiene un token este se alamacena en el LocalStorage.
        .then(result => {
            if (result.token) {
                localStorage.setItem('token', result.token);
                setLoginSuccessful(true);
            } else {
                setLoginSuccessful(false);
                setError('Credenciales incorrectas');
            }
        })
        .catch(error => {
            setError('Hubo un error en la solicitud. Inténtalo de nuevo.');
            console.log(error);
        });
    }

    return (
        <>
            {loginSuccessful ? (
                <Home />
            ) : (
                <div>
                    <form>
                        <label>Username:</label>
                        <input
                            onChange={(event) => { setUsername(event.target.value) }}
                            type='text'
                        />
                        <label>Password</label>
                        <input
                            onChange={(event) => { setPassword(event.target.value) }}
                            type='password'
                        />
                        <button onClick={handleLogin}>Ingresar</button>
                        {error && <div className="error">{error}</div>}
                    </form>
                </div>
            )}
        </>
    );
}

export default Login;
