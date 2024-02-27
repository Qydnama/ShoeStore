document.addEventListener('DOMContentLoaded', async () => {
    const currentLang = document.documentElement.lang;

    const locale = {
        en: {
            "t": "Tenge:",
            "r": "Ruble:",
            "s": "Sum:"
        },
        ru: {
            "t": "Курс тенге:",
            "r": "Курс рубля:",
            "s": "Курс cум:"
        }
    };

    const factResponse = await fetch(`/cat`);
    const factData = await factResponse.json();
    document.getElementById('catFactText').textContent = factData.fact.fact;
    document.getElementById('catImageSrc').src = factData.image[0].url;

    const currencyResponse = await fetch(`currency`);
    const currencyData = await currencyResponse.json();

    const rateKZT = parseInt(currencyData.data.KZT.value);
    const rateRUB = parseInt(currencyData.data.RUB.value);
    const rateUZS = parseInt(currencyData.data.UZS.value);

    document.getElementById('currencyKZT').textContent = `${locale[currentLang].t} ${rateKZT} KZT`;
    document.getElementById('currencyRUB').textContent = `${locale[currentLang].r} ${rateRUB} RUB`;
    document.getElementById('currencyUZS').textContent = `${locale[currentLang].s} ${rateUZS} UZS`;
});
