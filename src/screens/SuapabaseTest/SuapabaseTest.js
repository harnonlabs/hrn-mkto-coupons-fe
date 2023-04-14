import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { useGridApiEventHandler } from "@mui/x-data-grid"

const supabase = createClient(
  "https://onvqzqkjzbkprjgrsqrb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9udnF6cWtqemJrcHJqZ3JzcXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA2MzE2NTYsImV4cCI6MTk5NjIwNzY1Nn0.8qui7dZhi_noDerDr1m5I81ysRONjaanpKBW3GbNAxo"
)

function App() {
  const [countries, setCountries] = useState([])

  useEffect(() => {
    getCountries()
  }, [])

  async function getCountries() {
    const { data } = await supabase.from("countries").select()
    setCountries(data)
  }

  async function insertCountries() {
    const { data, error } = await supabase
      .from("countries")
      .insert([{ name: "colombia" }])
  }

  async function updateCountries() {
    const { data, error } = await supabase
      .from("countries")
      .update({ name: "aruba" })
      .eq("name", "colombia")
  }

  async function deleteCountries() {
    const { data, error } = await supabase
      .from("countries")
      .delete()
      .eq("name", "aruba")
  }

  return (
    <div>
      <ul>
        {countries.map((country) => (
          <li key={country.name}>{country.name}</li>
        ))}
      </ul>
      <button onClick={insertCountries}>Insert</button>
      <button onClick={updateCountries}>Update</button>
      <button onClick={deleteCountries}>Delete</button>
    </div>
  )
}

export default App
