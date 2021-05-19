const manager = new Manager();
const renderer = new Renderer();

const loadPage = async () => {
  const cityData = await manager.getDataFromDB();
  renderer.renderData(cityData.reverse());
};

const handleSearch = async () => {
  const cityName = $('.city-input').val();
  $('.city-input').val('');
  await manager.getCityData(cityName);
  renderer.renderData(manager.cityData);
};

//***************************************************************

loadPage();

//************** EVENT-LISTENERS *********************************
$('.cities').on('click', '.delete-btn', function () {
  let cityName = $(this).closest('.city').find('.cityName').html().trim();
  manager.removeCity(cityName);
  loadPage();
});

$('.cities').on('click', '.update-btn', async function () {
  let cityName = $(this).closest('.city').find('.cityName').html().trim();
  await manager.updateCity(cityName);
  loadPage();
});

$(document).on('keypress', function (e) {
  if (e.which == 13) {
    handleSearch();
    $('.city-input').blur();
  }
});
