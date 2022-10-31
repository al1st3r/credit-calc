let initRange = function() {
  $('.polzunok-2').each(function () {
    $(this).slider({
        min: +$(this).parents('.calculator__form-box').find('input.input').attr('min'),
        max: +$(this).parents('.calculator__form-box').find('input.input').attr('max'),
        value: $(this).parents('.calculator__form-box').find('input.input').val(),
        range: "min",
        animate: "fast",
        slide: function(event, ui) {
            let input = $(this).parents('.calculator__form-box').find('input.input');
            input.val(ui.value);
            minMax();
            calculating();
        }
    });
})}

initRange();

$('input').each(function () {
    $(this).on('keyup change', function () {
        minMax();
        calculating();
        initRange();
    })
})

let calculating = function() {
    setTimeout(function () {
        let $percent = $('#contrib').val();
        let $price = $('#price').val();
        let $pay = $price / 100 * $percent
        let $term = $('#term').val();
        let $stavka = (($price - $pay) * ((0.035 * Math.pow((1 + 0.035), $term)) / (Math.pow((1 + 0.035), $term) - 1))).toFixed(0);
        let $sum = ($pay + $term * $stavka).toFixed(0)

        $('#sum').val($sum + '₽')
        $('#pay').val($stavka + '₽')
        $('#perMonth').val($pay.toFixed(0) + '₽')
    }, 0)
}

let minMax = function () {
    const inputs = $('input[type=number]');
    console.log(inputs)
    $.each(inputs, function(index, input) {
        const min = +input.min;
        const max = +input.max;

        $(input).on('blur', (e) => {
            const value = +input.value;

            if (value > max) { input.value = max }
            else if (value < min) { input.value = min }
        });
    });
}

$('.calculator__form').submit(function (e) {
    e.preventDefault();
    console.log( $(this).serialize() );
    $('.calculator__form-submit').addClass('loading')
    $('input.input').attr('readonly', true)
    $('.calculator__form-box').addClass('disabled')
    setTimeout(function () {
        $.ajax({
            type: $(this).attr('method'),
            url: 'https://eoj3r7f3r4ef6v4.m.pipedream.net',
            data: $(this).serialize(),
            async: false,
            contentType: 'application/json',
            dataType: 'json',
            success: function () {
                $('.calculator__form-submit').removeClass('loading').text('Успешно!')
                $('input.input').attr('readonly', false)
                $('.calculator__form-box').removeClass('disabled')
                setTimeout(function () {
                    $('.calculator__form-submit').text('Оставить заявку')

                }, 3000)
            },
            error: function () {
                $('.calculator__form-submit').removeClass('loading').text('Ошибка')
                $('input.input').attr('readonly', false)
                $('.calculator__form-box').removeClass('disabled')
                setTimeout(function () {
                    $('.calculator__form-submit').text('Оставить заявку')

                }, 3000)
            }
        })
    }, 1000)

})

