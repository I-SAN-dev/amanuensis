/**
 * @class ama.filters.twoDecimals
 * # The twoDecimals filter
 * Formats a number to two decimals
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
 *     {{'5.25'|twoDecimals}} -> 5,25
 *
 * JavaScript:
 *
 *     $filter('twoDecimals')(5.25) -> '5,25'
 */
app.filter('twoDecimals', function () {
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
            return ((Math.round(number * 100) / 100).toFixed(2)).replace('.',',');
        }

    };
});