import { SplashScreen } from "../components";
import { useState } from "react";
import { useParams } from "react-router";

export default function Contact() {
const [isLoading, setIsLoading] = useState(true)
const { id } = useParams();

console.log(id)
  return ( <h1>cysds</h1>
  );
}
