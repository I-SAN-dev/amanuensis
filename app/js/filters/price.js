/**
 * @class ama.filters.price
 * # The price filter
 * Formats a number as price.
 *
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 *
 * @license GPL
 *
 * ## Usage
 * HTML:
 *
 *     {{'5.25'|price}} -> 5,25 €
 *
 * JavaScript:
 *
 *     $filter('price')(5.25) -> '5,25 €'
 */
app.filter('price', function () {
    return function (value) {

        var number = parseFloat(value);

        /* return input if we got something weird */
        if(isNaN(number))
        {
            return value;
        }
        /* return 2 after comma decimals */
        else
        {
            return ((Math.round(number * 100) / 100).toFixed(2) + ' €').replace('.',',');
        }

    };
});