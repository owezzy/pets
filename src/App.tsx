import React, {useEffect} from 'react';
import {Amplify, API} from "aws-amplify";
import config from './aws-exports'
import {withAuthenticator, useAuthenticator } from "@aws-amplify/ui-react";
import './App.css';
import '@aws-amplify/ui-react/styles.css';



Amplify.configure(config)

function App() {
    const [petName, setName] = React.useState('')
    const [petType, setType] = React.useState('')
    const [pets, setPets] = React.useState([])

    useEffect(() => {
            API.get('petsapi', '/pets/name', []).then(res => {

                // @ts-ignore
                setPets([...pets, ...res])
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { user, signOut } = useAuthenticator((context) => [context.user]);

    const handleSubmit = (e: any) => {
        e.preventDefault()
        API.post('petsapi', '/pets', {
            body: {
                names: petName,
                type: petType
            }
        }).then(() => {
            // @ts-ignore
            setPets([{names: petName, type: petType}, ...pets]);
        })
    }

    return (
    <div className="App">
      <header className="App-header">
          <h2>Welcome, {user.username}!</h2>

          <form onSubmit={handleSubmit}>
              <input value={petName} placeholder='PetName' onChange={(e) =>setName(e.target.value)}/>
              <input value={petType} placeholder='petType' onChange={(e) =>setType(e.target.value)}/>
              <button>Add Pet</button>
          </form>
          <ul>
              { pets.map((pet) => (
                  // @ts-ignore
                  <li key={pet.names}> {pet.names} </li>
              )) }
          </ul>

          <button color='red' onClick={signOut}>Sign Out</button>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
