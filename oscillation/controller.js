window.onload = () => {

    let showTimeEle = ele('showTime');
    showTimeEle.addEventListener('change', (e) => {
        showTime = showTimeEle.checked;
    });

    let showPartsEle = ele('showParts');
    showPartsEle.addEventListener('change', (e) => {
        showParts = showPartsEle.checked;
    });

    let setSizeEle = ele('setSize');
    setSizeEle.addEventListener('change', (e) => {
        if (setSizeEle.checked) {
            sizeEle.style.display = "block";
        } else {
            sizeEle.value = 600;
            size = 600;
            sizeEle.style.display = "none";
        }
    });
    let sizeEle = ele('size');
    sizeEle.addEventListener('input', (e) => {
        size = parseInt(sizeEle.value);
    });


    let showWaveEle = ele('showWave');
    showWaveEle.addEventListener('change', (e) => {
        showWave = showWaveEle.checked;
        if (showWave) {
            wavePeriodEle.style.display = "block";
        } else {
            wavePeriodEle.style.display = "none";
        }
    });

    let wavePeriodEle = ele('wavePeriod');
    wavePeriodEle.addEventListener('input', (e) => {
        period = parseInt(wavePeriodEle.value);
    });

    let timelapseEle = ele('timelapse');
    timelapseEle.addEventListener('change', (e) => {
        timelapse = timelapseEle.checked;
        if (timelapse) {
            timelapseSpeedEle.style.display = "block";
        } else {
            timelapseSpeedEle.style.display = "none";
        }
    });

    let timelapseSpeedEle = ele('timelapseSpeed');
    timelapseSpeedEle.addEventListener('input', (e) => {
        timelapseSpeed = parseInt(timelapseSpeedEle.value);
    });

    let timezoneEle = ele('timezone');
    timezoneEle.addEventListener('input', (e) => {
        changeTimeZone(parseInt(timezoneEle.value));
    })

}

function ele(id) {
    return document.getElementById(id);
}