$(document).ready(function () {
  const brandList = $("#brandList");


  $.ajax({
    url: "/get-brands",
    method: "GET",
    success: function (brands) {
      brands.forEach(brand => {
        brandList.append(`<li class="brand-item" data-brand="${brand}">${brand}</li>`);
      });
    }
  });


  $(document).on("mouseenter", ".brand-item", function () {
    const brand = $(this).data("brand");


    const submenu = $('<div class="submenu model-menu"><ul></ul></div>');
    $(this).append(submenu);

    const modelList = submenu.find("ul");


    $.ajax({
        url: `/models/${brand}`,
        method: "GET",
        success: function(models) {
            models.forEach(model => {
                modelList.append(`<li class="model-item" data-brand="${brand}" data-model="${model}">${model}</li>`);
            });
        },
        error: function() {
            modelList.append('<li>Error loading models</li>');
        }
    });
});



  $(document).on("mouseenter", ".model-item", function () {
    const { brand, model } = $(this).data();

    const submenu = $('<div class="submenu gear-menu"><ul></ul></div>');
    $(this).append(submenu);

    const gearList = submenu.find("ul");
    ["Manuel", "Automatic"].forEach(gear => {
      gearList.append(`<li class="gear-item" data-brand="${brand}" data-model="${model}" data-gear="${gear}">${gear}</li>`);
    });
  });


  $(document).on("mouseenter", ".gear-item", function () {
    const { brand, model, gear } = $(this).data();

    const submenu = $('<div class="submenu fuel-menu"><ul></ul></div>');
    $(this).append(submenu);

    const fuelList = submenu.find("ul");
    ["Petrol", "Diesel", "Electric", "Hybrid"].forEach(fuel => {
      fuelList.append(`<li class="fuel-item" data-brand="${brand}" data-model="${model}" data-gear="${gear}" data-fuel="${fuel}">${fuel}</li>`);
    });
  });


  $(document).on("mouseenter", ".fuel-item", function () {
    const { brand, model, gear, fuel } = $(this).data();

    const submenu = $('<div class="submenu year-menu"><ul></ul></div>');
    $(this).append(submenu);

    const yearList = submenu.find("ul");
    const years = Array.from({ length: 15 }, (_, i) => 2025 - i);
    years.forEach(year => {
      yearList.append(`<li class="year-item" data-brand="${brand}" data-model="${model}" data-gear="${gear}" data-fuel="${fuel}" data-year="${year}">${year}</li>`);
    });
  });


  $(document).on("click", ".year-item", function () {
    const { brand, model, gear, fuel, year } = $(this).data();
    const url = `/filter?Brand=${brand}&Model=${model}&Gear_type=${gear}&Fuel_type=${fuel}&Year=${year}`;
    window.location.href = url;
  });
});
