function buscarMetarTaf() {
    const icao = document.getElementById('icaoInput').value.toUpperCase().trim();
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '';

    if (icao.length !== 4) {
        resultadoDiv.innerHTML = '<p style="color:red;">Digite um código ICAO válido (4 letras).</p>';
        return;
    }

    // =====================
    // Buscar METAR
    // =====================
    fetch(`https://avwx.rest/api/metar/${icao}?token=hDvkY5CocbPoNaN9qXqB4bk1wCvZc5z592ezz-DeML0`)
        .then(response => response.json())
        .then(data => {
            if (data.errors) {
                resultadoDiv.innerHTML = '<p style="color:red;">Erro ao buscar METAR.</p>';
            } else {
                const metar = `
                    <h3>METAR para ${icao}:</h3>
                    <p><strong>Raw:</strong> ${data.raw}</p>
                    <p><strong>Temperatura:</strong> ${data.temperature.repr}°C</p>
                    <p><strong>Ponto de Orvalho:</strong> ${data.dewpoint.repr}°C</p>
                    <p><strong>Vento:</strong> ${data.wind_direction.repr}° a ${data.wind_speed.repr}KT</p>
                    <p><strong>Visibilidade:</strong> ${data.visibility.repr} metros</p>
                    <p><strong>Condições de Nuvens:</strong> ${data.clouds.map(cloud => cloud.repr).join(', ')}</p>
                    <p><strong>Pressão do Altímetro:</strong> ${data.altimeter.repr} hPa</p>
                `;
                resultadoDiv.innerHTML += metar;
            }
        })
        .catch(() => {
            resultadoDiv.innerHTML = '<p style="color:red;">Erro ao acessar API do METAR.</p>';
        });

    // =====================
    // Buscar TAF
    // =====================
    fetch(`https://avwx.rest/api/taf/${icao}?token=hDvkY5CocbPoNaN9qXqB4bk1wCvZc5z592ezz-DeML0`)
        .then(response => response.json())
        .then(data => {
            if (data.errors) {
                resultadoDiv.innerHTML += '<p style="color:red;">Erro ao buscar TAF.</p>';
            } else {
                const forecast = data.forecast || [];
                let taf = `<h3>TAF para ${icao}:</h3>`;
                forecast.forEach(f => {
                    taf += `
                        <p><strong>Previsão até ${f.end_time.repr}:</strong> ${f.sanitized}</p>
                    `;
                });
                resultadoDiv.innerHTML += taf;
            }
        })
        .catch(() => {
            resultadoDiv.innerHTML += '<p style="color:red;">Erro ao acessar API do TAF.</p>';
        });

    // =====================
    // Exibir o Widget com bússola
    // =====================
    const widgetId = 'metar-iframe';
    const widgetContainer = document.getElementById('metar-taf-container');
    const iframeDiv = document.getElementById(widgetId);

    // Limpa conteúdo anterior
    iframeDiv.innerHTML = '';

    // Cria novo link e script
    const linkHTML = `<a href="https://metar-taf.com/pt/${icao}" id="${widgetId}" style="font-size:18px; font-weight:500; color:#000; width:300px; height:435px; display:block">METAR Aeroporto ${icao}</a>`;
    iframeDiv.innerHTML = linkHTML;

    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.src = `https://metar-taf.com/pt/embed-js/${icao}?u=FkeNwKkPDuZHGYQgxGzTkomlSKigjuS6&qnh=hPa&rh=rh&target=${widgetId}`;
    iframeDiv.appendChild(script);

    widgetContainer.style.display = 'block';
}
