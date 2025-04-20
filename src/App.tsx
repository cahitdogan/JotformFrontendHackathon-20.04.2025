import React from "react"
import { Button } from "./components/ui/button"
import Header from "./sections/Header";
import Products from "./sections/Products";

function App() {
  return (
    <>
      <Header/>
      <main>
        <Products/>
      </main>
    </>
  )
}

export default App;