'use strict';

var initRange = function initRange() {
    $('.range-slider').each(function () {
        $(this).slider({
            min: +$(this).parents('.calculator__form-box').find('input.input').attr('min'),
            max: +$(this).parents('.calculator__form-box').find('input.input').attr('max'),
            value: $(this).parents('.calculator__form-box').find('input.input').val(),
            range: "min",
            animate: "fast",
            slide: function slide(event, ui) {
                var input = $(this).parents('.calculator__form-box').find('input.input');
                input.val(ui.value);
                minMax();
                calculating();
            }
        });
    });
};

initRange();

$('input').each(function () {
    $(this).on('keyup change', function () {
        minMax();
        calculating();
        initRange();
    });
});

var calculating = function calculating() {
    setTimeout(function () {
        var $percent = $('#contrib').val();
        var $price = $('#price').val();
        var $pay = $price / 100 * $percent;
        var $term = $('#term').val();
        var $bet = (($price - $pay) * (0.035 * Math.pow(1 + 0.035, $term) / (Math.pow(1 + 0.035, $term) - 1))).toFixed(0);
        var $sum = ($pay + $term * $bet).toFixed(0);

        $('#sum').val($sum + '₽');
        $('#pay').val($bet + '₽');
        $('#perMonth').val($pay.toFixed(0) + '₽');
    }, 0);
};

var minMax = function minMax() {
    var inputs = $('input[type=number]');
    $.each(inputs, function (index, input) {
        var min = +input.min;
        var max = +input.max;

        $(input).on('blur', function (e) {
            var value = +input.value;

            if (value > max) {
                input.value = max;
            } else if (value < min) {
                input.value = min;
            }
        });
    });
};

var formAfterSubmit = function formAfterSubmit(message) {
    $('.calculator__form-submit').removeClass('loading').text(message);
    $('input.input').attr('readonly', false);
    $('.calculator__form-box').removeClass('disabled');
    setTimeout(function () {
        $('.calculator__form-submit').text('Оставить заявку');
    }, 3000);
};

$('.calculator__form').submit(function (e) {
    e.preventDefault();
    console.log($(this).serialize());
    $('.calculator__form-submit').addClass('loading');
    $('input.input').attr('readonly', true);
    $('.calculator__form-box').addClass('disabled');
    setTimeout(function () {
        $.ajax({
            type: $(this).attr('method'),
            url: 'https://eoj3r7f3r4ef6v4.m.pipedream.net',
            data: $(this).serialize(),
            async: false,
            contentType: 'application/json',
            dataType: 'json',
            success: function success() {
                formAfterSubmit('Успешно');
            },
            error: function error() {
                formAfterSubmit('Ошибка');
            }
        });
    }, 1000);
});