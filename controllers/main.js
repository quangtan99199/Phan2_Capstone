main();

function main() {
  // B1: Gọi API lấy danh sách sản phẩm

  apiGetProducts().then((result) => {
    // Tạo biến products nhận kết quả trả về từ API
    var products = result.data;
    console.log(result);
    console.log(result.data);
    // Sau khi đã lấy được data từ API thành công
    // Duyệt mảng data và khởi tạo các đối tượng Product
    for (var i = 0; i < products.length; i++) {
      var product = products[i];
      products[i] = new Product(
        product.id,
        product.name,
        product.price,
        product.screen,
        product.backCamera,
        product.frontCamera,
        product.img,
        product.desc,
        product.type
      );
    }
    console.log(products); // Gọi hàm display để hiển thị danh sách sản phẩm ra giao diện
    display(products);
  });
}

function display(products) {
  var html = "";
  for (var i = 0; i < products.length; i++) {
    var product = products[i];
    html += `
      <tr>
        <td>${i + 1}</td>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>${product.screen}</td>
        <td>${product.backCamera}</td>
        <td>${product.frontCamera}</td>
        <td>
          <img src="${product.img}" width="70px" height="70px" />
        </td>
        <td>${product.desc}</td>
        <td>${product.type}</td>
        <td>
          <button
            class="btn btn-primary"
            data-toggle="modal"
            data-target="#myModal"
            data-type="update"
            data-id="${product.id}"
          >
            Cập Nhật
          </button>
          <button
            class="btn btn-danger mt-2"
            data-type="delete"
            data-id="${product.id}"
          >
            Xoá
          </button>
        </td>
      </tr>
    `;
  }
  // DOM tới tbody và innerHTML bằng biến html
  document.getElementById("tblDanhSachSP").innerHTML = html;
}

// Hàm xử lý gọi API thêm sản phẩm
function addProduct() {
  // B1: DOM lấy value
  var name = document.getElementById("TenSP").value;
  var price = document.getElementById("GiaSP").value;
  var screen = document.getElementById("ManSP").value;
  var backCamera = document.getElementById("CamSauSP").value;
  var frontCamera = document.getElementById("CamTruocSP").value;
  var img = document.getElementById("HinhSP").value;
  var desc = document.getElementById("MoTaSP").value;
  var type = document.getElementById("LoaiSP").value;
  // B2: Khởi tạo đối tượng Product
  var product = new Product(
    null,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type
  );
  // B3: Gọi API thêm sản phẩm

  apiAddProduct(product)
    .then(function (result) {
      // Thêm thành công, tuy nhiên lúc này dữ liệu chỉ mới được thay đổi ở phía server
      // Gọi tới hàm main để call API get products và hiển thị ra giao diện
      main();
      resetForm();
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Hàm xử lý gọi API xoá sản phẩm
function deleteProduct(productId) {
  apiDeleteProduct(productId)
    .then(function () {
      console.log(productId);

      // Xoá thành công
      main();
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Hàm xử lý gọi API cập nhật sản phẩm
function updateProduct() {
  // B1: DOM lấy value
  var id = document.getElementById("MaSP").value; // hidden input
  var name = document.getElementById("TenSP").value;
  var price = document.getElementById("GiaSP").value;
  var screen = document.getElementById("ManSP").value;
  var backCamera = document.getElementById("CamSauSP").value;
  var frontCamera = document.getElementById("CamTruocSP").value;
  var img = document.getElementById("HinhSP").value;
  var desc = document.getElementById("MoTaSP").value;
  var type = document.getElementById("LoaiSP").value;

  // B2: Khởi tạo đối tượng Product
  var product = new Product(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type
  );

  // B3: Gọi API cập nhật sản phẩm
  apiUpdateProduct(product)
    .then(function (result) {
      // Cập nhật thành công, dữ liệu chỉ mới thay đổi ở phía server, cần gọi lại API getProducts và hiển thị lại giao diện (đã làm trong hàm main)
      main();
      resetForm();
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Hàm xử lý reset form và đóng modal
function resetForm() {
  // Reset form
  document.getElementById("MaSP").value = "";
  document.getElementById("TenSP").value = "";
  document.getElementById("GiaSP").value = "";
  document.getElementById("ManSP").value = "";
  document.getElementById("CamSauSP").value = "";
  document.getElementById("CamTruocSP").value = "";
  document.getElementById("HinhSP").value = "";
  document.getElementById("MoTaSP").value = "";
  document.getElementById("LoaiSP").value = "";


  // Đóng modal (vì sử dụng bootstrap nên phải tuân theo cách làm của nó)
  $("#myModal").modal("hide");
}

// DOM
document.getElementById("btnThemSP").addEventListener("click", showAddModal);
function showAddModal() {
  // Thay đổi text của modal heading
  document.querySelector(".modal-title").innerHTML = "Thêm sản phẩm";
  document.querySelector(".modal-footer").innerHTML = `
    <button
      class="btn btn-primary"
      data-type="add"
    >
      Thêm
    </button>
    <button
      class="btn btn-secondary"
      data-toggle="modal"
      data-target="#myModal"
    >
      Huỷ
    </button>
  `;
}

// Uỷ quyền lắng nghe event của các button từ thẻ .modal-footer
document.querySelector(".modal-footer").addEventListener("click", handleSubmit);
// Các hàm callback được gọi tới khi event được kích hoạt đồng thời nhận được 1 tham số là đối tượng Event
function handleSubmit(event) {
  var type = event.target.getAttribute("data-type");

  switch (type) {
    case "add":
      addProduct();
      break;
    case "update":
      updateProduct();
      break;
    default:
      break;
  }
}

// Uỷ quyền lắng nghe tất cả event của button Xoá và Cập nhật trong table cho tbody
document
  .getElementById("tblDanhSachSP")
  .addEventListener("click", handleProductAction);

function handleProductAction(event) {
  // Loại button (delete || update)
  var type = event.target.getAttribute("data-type");
  // Id của sản phẩm
  var id = event.target.getAttribute("data-id");

  switch (type) {
    case "delete":
      // console.log(id);
      deleteProduct(id);
      break;
    case "update": {
      // Cập nhật giao diện cho modal và call API get thông tin của sản phẩm và fill lên form
      showUpdateModal(id);
      // console.log("id,id", id);

      break;
    }

    default:
      break;
  }
}

// Hàm này dùng để cập nhật giao diện cho modal update và call API lấy chi tiết sản phẩm để hiển thị lên giao diện
function showUpdateModal(productId) {
  // Thay đổi text của modal heading/ modal footer
  document.querySelector(".modal-title").innerHTML = "Cập nhật sản phẩm";
  document.querySelector(".modal-footer").innerHTML = `
    <button
      class="btn btn-primary"
      data-type="update"
    >
      Cập nhật
    </button>
    <button
      class="btn btn-secondary"
      data-dismiss="modal"
    >
      Huỷ
    </button>
  `;

  // Call API để lấy chi tiết sản phẩm
  apiGetProductDetail(productId)
    .then(function (result) {
      // Thành công, fill data lên form
      var product = result.data;
      document.getElementById("MaSP").value = product.id;
      document.getElementById("TenSP").value = product.name;
      document.getElementById("GiaSP").value = product.price;
      document.getElementById("ManSP").value = product.screen;
      document.getElementById("CamSauSP").value = product.backCamera;
      document.getElementById("CamTruocSP").value = product.frontCamera;
      document.getElementById("HinhSP").value = product.img;
      document.getElementById("MoTaSP").value = product.desc;
      document.getElementById("LoaiSP").value = product.type;
    })
    .catch(function (error) {
      console.log(error);
    });
}

// DOM tới input search
document.getElementById("txtSearch").addEventListener("keypress", handleSearch);
function handleSearch(evt) {
  console.log(evt);
  // Kiểm tra nếu key click vào không phải là Enter thì bỏ qua
  if (evt.key !== "Enter") return;

  // Nếu key click vào là Enter thì bắt đầu lấy value của input và get products
  var value = evt.target.value;
  apiGetProducts(value).then(function (result) {
    // Tạo biến products nhận kết quả trả về từ API
    var products = result.data;
    // Sau khi đã lấy được data từ API thành công
    // Duyệt mảng data và khởi tạo các đối tượng Product
    for (var i = 0; i < products.length; i++) {
      var product = products[i];
      products[i] = new Product(
        product.id,
        product.name,
        product.price,
        product.screen,
        product.backCamera,
        product.frontCamera,
        product.img,
        product.desc,
        product.type
      );
    }
    // Gọi hàm display để hiển thị danh sách sản phẩm ra giao diện
    display(products);
  });
}
