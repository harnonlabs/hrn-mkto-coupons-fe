import "./App.css"
import React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import NonAuthScreen from "./screens/NonAuthScreen/NonAuthScreen"
import Header from "./components/Header/Header"
import AuthScreen from "./screens/AuthScreen/AuthScreen"

const defaultContext = {}
export const AppContext = React.createContext(defaultContext)

function App() {
  const [token, setToken] = React.useState()
  const { getAccessTokenSilently, isLoading } = useAuth0()

  console.log(process.env.REACT_APP_WORKER_URL)

  React.useEffect(() => {
    async function callAccessToken() {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: `https://hrn-auth.harnon.co`,
          scope: "manage:coupons",
        })

        setToken(accessToken)
      } catch (e) {
        console.log(e.message)
      }
    }
    callAccessToken()
  }, [getAccessTokenSilently])

  return (
    <AppContext.Provider value={{ token }}>
      {isLoading ? (
        "Loading..."
      ) : (
        <div className="login">
          {token ? <AuthScreen /> : <NonAuthScreen />}
        </div>
      )}
    </AppContext.Provider>
  )
}

export default App
