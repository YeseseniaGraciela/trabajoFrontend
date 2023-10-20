import { useState, useEffect } from "react";
import "./Home.css";
const Home = () => {
  // almacena los usuarios obtenidas del servidor
  const [users, setUsers] = useState([]);
  // alamcena la información del usuario a crearse
  const [newUser, setNewUser] = useState({ username: "", password: "" });
  // almacena el usuario que se va a editar
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Obtener la lista de usuarios al cargar el componente
    fetch("http://localhost:3000/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error(error));
  }, []);

  const createUser = () => {
    const token = localStorage.getItem("token");
    // Crear un nuevo usuario
    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        auth: token, //Se agrega el token de autenticación en las cabeceras
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then(() => {
        fetch("http://localhost:3000/users")
          .then((response) => response.json())
          .then((updatedData) => {
            setUsers(updatedData); //Actualiza el estado 'users' con los datos actualizados
            setNewUser({ username: "", password: "" });
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  const updateUser = () => {
    const token = localStorage.getItem("token");
    // Actualizar un usuario existente
    if (selectedUser) {
      fetch(`http://localhost:3000/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          auth: token, //Se agrega el token de autenticación en las cabeceras
        },
        body: JSON.stringify(selectedUser),
      })
        .then((response) => response.json())
        .then(() => {
          // Realizar una solicitud GET adicional para obtener los datos actualizados
          fetch("http://localhost:3000/users")
            .then((response) => response.json())
            .then((updatedData) => {
              setUsers(updatedData); //Actualiza el estado 'users' con los datos actualizados
              setNewUser({ username: "", password: "" });
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.error(error));
    }
    setSelectedUser("");
  };

  const deleteUser = (id) => {
    const token = localStorage.getItem("token");
    // Eliminar un usuario
    fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
      headers: {
        auth: token, //Se agrega el token de autenticación en las cabeceras
      },
    })
      .then(() => {
        const filteredUsers = users.filter((user) => user.id !== id);
        setUsers(filteredUsers); //Actualiza el estado 'users' con los datos actualizados
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="container">
      <h1>Usuarios</h1>
      <div className="user-form">
        <h2>Crear Usuario</h2>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <button onClick={createUser}>Crear</button>
      </div>
      {selectedUser && (
        <div className="user-form">
          <h2>Editar Usuario</h2>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={selectedUser.username}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, username: e.target.value })
            }
          />
          <button onClick={updateUser}>Guardar cambios</button>
          <button onClick={updateUser}>Cancelar</button>
        </div>
      )}
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td className="username">{user.username}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => setSelectedUser(user)}
                >
                  Editar
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteUser(user.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
