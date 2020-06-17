import moment from "moment";
import localization from "moment/locale/uk";

moment.updateLocale(localization, 'uk');
moment.locale('uk');
moment.fn.toJSON = function() {
    return this.format("YYYY-MM-DD");
}

export default moment;
