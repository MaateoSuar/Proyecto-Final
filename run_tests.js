const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const config = {
  collectionPath: './postman_collection.json',
  environmentPath: './postman_environment.json',
  reportPath: './test-reports',
  baseUrl: process.env.BASE_URL || 'http://localhost:5000'
};

if (!fs.existsSync(config.reportPath)) {
  fs.mkdirSync(config.reportPath, { recursive: true });
}

function runNewman() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = path.join(config.reportPath, `test-report-${timestamp}.html`);
  
  const command = `npx newman run "${config.collectionPath}" \
    --environment "${config.environmentPath}" \
    --reporters cli,html \
    --reporter-html-export "${reportFile}" \
    --bail \
    --timeout-request 10000 \
    --timeout-script 10000`;

  console.log('Iniciando pruebas de integración...');
  console.log(`URL Base: ${config.baseUrl}`);
  console.log(`Reporte: ${reportFile}`);
  console.log('Ejecutando pruebas...\n');

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Error ejecutando las pruebas:', error);
      process.exit(1);
    }

    if (stderr) {
      console.warn('Advertencias:', stderr);
    }

    console.log('Resultados de las pruebas:');
    console.log(stdout);

    // Verificar si el reporte se generó
    if (fs.existsSync(reportFile)) {
      console.log(`\nReporte HTML generado: ${reportFile}`);
      console.log('Abre el archivo en tu navegador para ver los resultados detallados');
    }

    // Analizar resultados
    const results = analyzeResults(stdout);
    printSummary(results);
  });
}

// Función para analizar los resultados
function analyzeResults(output) {
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    duration: 0
  };

  // Extraer estadísticas del output
  const statsMatch = output.match(/iterations:\s*(\d+).*?requests:\s*(\d+).*?test-scripts:\s*(\d+).*?prerequest-scripts:\s*(\d+).*?assertions:\s*(\d+).*?total run duration:\s*(\d+)/s);
  
  if (statsMatch) {
    results.total = parseInt(statsMatch[2]) || 0;
    results.duration = parseInt(statsMatch[6]) || 0;
  }

  // Contar resultados
  const passedMatch = output.match(/passed:\s*(\d+)/);
  const failedMatch = output.match(/failed:\s*(\d+)/);
  const skippedMatch = output.match(/skipped:\s*(\d+)/);

  if (passedMatch) results.passed = parseInt(passedMatch[1]);
  if (failedMatch) results.failed = parseInt(failedMatch[1]);
  if (skippedMatch) results.skipped = parseInt(skippedMatch[1]);

  return results;
}

// Función para imprimir resumen
function printSummary(results) {
  console.log('\nRESUMEN DE PRUEBAS');
  console.log('='.repeat(50));
  console.log(`Total de requests: ${results.total}`);
  console.log(`Exitosas: ${results.passed}`);
  console.log(`Fallidas: ${results.failed}`);
  console.log(`Omitidas: ${results.skipped}`);
  console.log(`Duración: ${results.duration}ms`);
  
  const successRate = results.total > 0 ? ((results.passed / results.total) * 100).toFixed(2) : 0;
  console.log(`📈 Tasa de éxito: ${successRate}%`);

  if (results.failed > 0) {
    console.log('\n Algunas pruebas fallaron. Revisa el reporte HTML para más detalles.');
    process.exit(1);
  } else {
    console.log('\n ¡Todas las pruebas pasaron exitosamente!');
  }
}

// Función para verificar dependencias
function checkDependencies() {
  console.log(' Verificando dependencias...');
  
  // Verificar si Newman está instalado
  exec('npx newman --version', (error) => {
    if (error) {
      console.log(' Instalando Newman...');
      exec('npm install -g newman', (installError) => {
        if (installError) {
          console.error(' Error instalando Newman:', installError);
          process.exit(1);
        }
        console.log(' Newman instalado correctamente');
        runNewman();
      });
    } else {
      console.log(' Newman ya está instalado');
      runNewman();
    }
  });
}

// Función para crear archivo de entorno si no existe
function createEnvironmentFile() {
  const envPath = config.environmentPath;
  
  if (!fs.existsSync(envPath)) {
    const environment = {
      id: "test-environment",
      name: "Test Environment",
      values: [
        {
          key: "baseUrl",
          value: config.baseUrl,
          type: "default",
          enabled: true
        },
        {
          key: "token",
          value: "",
          type: "secret",
          enabled: true
        },
        {
          key: "userId",
          value: "",
          type: "default",
          enabled: true
        },
        {
          key: "petId",
          value: "",
          type: "default",
          enabled: true
        },
        {
          key: "reservationId",
          value: "",
          type: "default",
          enabled: true
        },
        {
          key: "providerId",
          value: "",
          type: "default",
          enabled: true
        },
        {
          key: "locationId",
          value: "",
          type: "default",
          enabled: true
        }
      ]
    };

    fs.writeFileSync(envPath, JSON.stringify(environment, null, 2));
    console.log(' Archivo de entorno creado:', envPath);
  }
}


function main() {
  console.log(' TEST RUNNER - PROYECTO FINAL');
  console.log('='.repeat(50));
  

  if (!fs.existsSync(config.collectionPath)) {
    console.error(' No se encontró el archivo de colección:', config.collectionPath);
    console.log(' Asegúrate de que el archivo postman_collection.json esté en el directorio raíz');
    process.exit(1);
  }


  createEnvironmentFile();
  

  checkDependencies();
}


if (require.main === module) {
  main();
}

module.exports = {
  runNewman,
  analyzeResults,
  printSummary,
  checkDependencies,
  createEnvironmentFile
}; 