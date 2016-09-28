

var Ejercicio2 = function () {

    this.series = new Array();

    this.seriesPie = new Array();

    //Configuración de AJAX
    $.ajaxSetup({
        async: false
    });
};


Ejercicio2.prototype.addToSeries = function (point) {

    //Si no existe la categoría, creamos la serie
    if (!this.existsSerie(point.category)) {

        this.series.push({
            name: point.category,
            data: new Array()
        });

        this.series.sort(function (a, b) { return a.name < b.name });
    }

    //Añadimos el punto a la colección de series
    for (var i = 0; i < this.series.length; i++) {
        if (this.series[i].name == point.category) {

            var pointExists = false;
            for (var j = 0; j < this.series[i].data.length; j++) {
                //Si el punto (categoria,fecha) ya existe, sumamos el valor
                if (this.series[i].data[j][0] == point.date) {
                    this.series[i].data[j][1] += point.value;
                    pointExists = true;
                }
            }

            //Si no existe, lo añadimos
            if (!pointExists) {
                this.series[i].data.push([point.date, point.value]);
            }

            //Reordenamos el array por fecha
            this.series[i].data.sort(function (a, b) { return a[0] < b[0] });
        }
    }
};

Ejercicio2.prototype.existsSerie = function (name) {
    for (var i = 0; i < this.series.length; i++) {
        if (this.series[i].name == name)
        { return true; }
    }
    return false;
};

Ejercicio2.prototype.parseAndAddData1 = function (data) {
    for (var i = 0; i < data.length; i++) {
        this.addToSeries({
            category: data[i].cat.toUpperCase(),
            date: data[i].d,
            value: data[i].value
        });
    }
};

Ejercicio2.prototype.parseAndAddData2 = function (data) {
    for (var i = 0; i < data.length; i++) {
        this.addToSeries({
            category: data[i].categ.toUpperCase(),
            date: Date.parse(data[i].myDate),
            value: data[i].val
        });
    }
};

Ejercicio2.prototype.parseAndAddData3 = function (data) {
    for (var i = 0; i < data.length; i++) {
        var regExFecha = /\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])/
        var regExCat = /#([^#]+)#/

        this.addToSeries({
            category: regExCat.exec(data[i].raw)[1].toUpperCase(),
            date: Date.parse(regExFecha.exec(data[i].raw)[0]),
            value: data[i].val
        });
    }
};

Ejercicio2.prototype.buildPieData = function () {
    var seriePie = {
        name: "Categorías",
        colorByPoint: true,
        data: new Array()
    };

    var sumCat = this.getSumCategoryValues();
    for (var i = 0; i < sumCat.categories.length; i++) {
        seriePie.data.push({
            name: sumCat.categories[i].name,
            y: (sumCat.categories[i].total / sumCat.total) * 100
        });
    }

    seriePie.data.sort(function (a, b) { return a.y < b.y });


    this.seriesPie.push(seriePie);
};

Ejercicio2.prototype.getSumCategoryValues = function () {
    var sumCategories = {
        categories: new Array(),
        total: 0
    };

    //Obtenemos la suma de todo
    for (var i = 0; i < this.series.length; i++) {
        var cat = {
            name: this.series[i].name,
            total: 0
        };

        for (var j = 0; j < this.series[i].data.length; j++) {
            cat.total += this.series[i].data[j][1];
        }

        sumCategories.categories.push(cat);
        sumCategories.total += cat.total;
    }

    return sumCategories;
};

Ejercicio2.prototype.loadData = function () {
    var self = this;

    //Serie 1
    $.getJSON('/series/data1.json', function (data) {
        self.parseAndAddData1(data);
    });

    //Serie 2
    $.getJSON('/series/data2.json', function (data) {
        self.parseAndAddData2(data);
    });

    //Serie 3
    $.getJSON('/series/data3.json', function (data) {
        self.parseAndAddData3(data);
    });

    //Serie PieChart
    self.buildPieData();

};

Ejercicio2.prototype.printLinesChart = function (containerId) {

    $("#" + containerId).highcharts({
        title: {
            text: "Ejercicio 2"
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Fecha'
            }
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },

        yAxis: {
            title: {
                text: "Valor"
            }
        },
        series: this.series
    });
};

Ejercicio2.prototype.printPieChart = function (containerId) {
    $("#" + containerId).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Test'
        },
        //tooltip: {
        //    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        //},
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: this.seriesPie
    });
};
