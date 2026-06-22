import testCases from './eval_cases.json';
import { ejecutarAgente } from '../src/agent/react_loop'; // Tu función principal

async function runEvals() {
    let passed = 0;
    const results = [];

    console.log(`Iniciando evaluación de ${testCases.length} casos...\n`);

    for (const test of testCases) {
        console.log(`Ejecutando [${test.id}]...`);
        const agentResponse = await ejecutarAgente(test.question);
        
        let isPass = false;
        const respLower = agentResponse.toLowerCase();
        const expectedLower = test.expected_data_point.toLowerCase();

        // Lógica de evaluación simple
        switch (test.eval_type) {
            case 'exact_match':
            case 'contains':
                isPass = respLower.includes(expectedLower);
                break;
            case 'contains_rejection':
                // Evaluar que el agente se niegue a responder amablemente
                isPass = respLower.includes("no tengo") || respLower.includes("no puedo") || respLower.includes("no hay información");
                break;
            case 'semantic_similarity':
                // En un caso real de 5 horas, evalúas 'contains' palabras clave.
                // Si sobra tiempo, puedes usar el modelo de embeddings para comparar similitud.
                isPass = respLower.includes("0%") || respLower.includes("fuerza mayor");
                break;
        }

        if (isPass) passed++;
        
        results.push({
            id: test.id,
            category: test.category,
            pass: isPass,
            // Solo guardamos la respuesta real si falló para analizarla en el reporte
            real_response: isPass ? "OK" : agentResponse 
        });
    }

    // Reporte final
    console.log(`\n=== RESULTADOS DE LA EVALUACIÓN ===`);
    console.log(`Accuracy Global: ${((passed / testCases.length) * 100).toFixed(2)}% (${passed}/${testCases.length})`);
    
    const fallos = results.filter(r => !r.pass);
    if (fallos.length > 0) {
        console.log(`\nRevisar los siguientes fallos en la bitácora:`);
        console.table(fallos);
    }
}

runEvals();