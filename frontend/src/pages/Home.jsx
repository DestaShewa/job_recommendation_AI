import { useState } from "react";
import SkillForm from "../components/SkillForm";
import ResultCard from "../components/ResultCard";

function Home() {
    const [result, setResult] = useState("");

    return (
        <div className="glass-container">
            <h1>IT & Software Engineering Domain</h1>
            <p className="subtitle">Find your ideal career using AI</p>

            <SkillForm setResult={setResult} />

            <ResultCard result={result} />
        </div>
    );
}

export default Home;
