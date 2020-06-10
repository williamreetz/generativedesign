$(document).ready(function () {
    function show() {
        $(".navbar").animate({
            opacity: 1,
            left: "0"
        }, 200, () => { });
    }

    function hide() {
        $(".navbar").animate({
            opacity: 0.25,
            left: "-300"
        }, 400, () => { });
    }

    $(".nav-animation").click(() => {
        mode = 0;
        $(".animation-menu").show();
        $(".grid-menu").hide();
        $(".generator-menu").hide();
    });
    $(".nav-grid").click(() => {
        mode = 1;
        $(".animation-menu").hide();
        $(".grid-menu").show();
        $(".generator-menu").hide();
    });
    $(".nav-generator").click(() => {
        mode = 2
        $(".animation-menu").hide();
        $(".grid-menu").hide();
        $(".generator-menu").show();
    });
    $(".grid-menu").hide();
    $(".generator-menu").hide();

    $("#darkmode").change(() => {
        let isChecked = $('#darkmode').prop('checked');
        darkmodeIsActive = isChecked;
    });

    $("#show-grid").change(() => {
        let isChecked = $('#show-grid').prop('checked');
        gridareaIsVisible = isChecked;
    })

    $('#grid-size').on('input', () => {
        let value = $('#grid-size').prop('value');
        gridSize = parseInt(value);
        grid = new Grid(gridSize);
        initLogos();
    });

    $('#animation-speed').on('input', () => {
        let value = $('#animation-speed').prop('value');
        animation.speed = parseFloat(value);
    });

    $('#animation-size').on('input', () => {
        let value = $('#animation-size').prop('value');
        animation.resize(parseFloat(value));
    });

    $('#animation-period').on('input', () => {
        let value = $('#animation-period').prop('value');
        animation.period = parseFloat(value);
    });

    $('#animation-amplitude').on('input', () => {
        let value = $('#animation-amplitude').prop('value');
        animation.amplitude = parseFloat(value);
    });

    $('#logo-size').on('input', () => {
        let value = $('#logo-size').prop('value');
        singleLogo.resize(parseFloat(value));
    });

    $('#logo-speed').on('input', () => {
        let value = $('#logo-speed').prop('value');
        logoChangeSpeed = parseFloat(value);
    });

    setTimeout(() => {
        hide();
        setTimeout(() => {
            $(".overlay").mouseenter(() => {
                show();
            });

            $(".navbar").mouseleave(() => {
                hide();
            });
        }, 600);
    }, 600);
});