let catdata = {};
let bookdata = {};
let bookdatarel = {};


// renderfilter => filters the books based on categories

function renderfilters(catid) {

  $.post("http://localhost/Ulib/BackEnd/models/filterByCategories.php", { catid }, function (data, status) {


    bookdata = JSON.parse(data);
    console.log(bookdata);
    $(document).ready(function () {

      // Creating the books components

      bookdata.map(function (element, index) {
        $(".book-container").append(
          "<div class=block id=" + index + ">" +
          "<img class=block-img src=" + element.imgurl + " /> " +
          "<h2 class=block-title > " + element.title + "</h2>"
          +


          "</div>"
        );

        // creating the onclick popups

        $(".store-container").append(
          "<div class=block-modal id=t" + index + "> <h1 class=block-x-btn> X </h1>" +
          "<img class=modal-block-img src=" + element.imgurl + " /> " +
          "<h2 class=modal-block-title > " + element.title + "</h2>" +
          "<h4 class=modal-block-author> " + "Author: " + element.author + "</h4>" +
          "<h4 class=modal-block-author> " + "Price: " + element.price + "$ </h4>" +
          "<h5 class=modal-block-descp > Description: " + element.description + " </h5> " +
          "<h5 class=modal-block-category>    </h5>" +

          "<div class=buy-btn > Purchase </div> </div>"
        );

        // creating the categories inside the modal

        if (element.category !== undefined) {
          element.category.map(function (element1, index1) {
            if (index1 === 0) {
              $("#" + index).find(".block-category").append(
                "" + element1 + " "
              );
              $("#t" + index).find(".modal-block-category").append(
                "<span>" + element1 + " </span>"

              );
            }
            else {
              $("#" + index).find(".block-category").append(
                " " + element1 + " "
              );
              $("#t" + index).find(".modal-block-category").append(
                "<span>" + element1 + " </span>"

              );
            }

          });

        }
      });
      bookdata.map(function (element, index) {
        $(".book-container").children("#" + index + ".block").click(function () {
          $(" #t" + index).fadeToggle(200);
          $(" #t" + index).css("display", "flex");
          $(".book-container").toggleClass("blurred");
          $(".book-container").css("pointer-events", "none");
          $(" #t" + index + " > h1").click(function () {
            $(" #t" + index).fadeOut(200);
            $(".book-container").removeClass("blurred");
            $(".book-container").css("pointer-events", "auto");
          });

        });;
      });
    });
  });
}

$.get("http://localhost/Ulib/BackEnd/models/categories.php", function (data, status) {
  $.get("http://localhost/Ulib/BackEnd/models/Ebooks.php", function (data3, status3) {
    catdata = JSON.parse(data);
    bookdatarel = JSON.parse(data3);


    //  dashboard - adding the add relation option
    $(".add-relation").append(
      "<h2>Add Relation</h2>" +
      "<h3>Select category</h3>" +
      "  <select id=catselect name=catselect>" +
      "  </select>");
    catdata.name.map(function (element, index) {
      $("#catselect").append(new Option(element, catdata.catid[index]));
    });
    $(".add-relation").append(
      "<h3>Select Book</h3>" +
      "  <select id=bookselect name=books>" +
      "  </select>" +
      "  <input type=submit value=submit >" +
      "<p class=relation-comf> relation added </p>"
    );
    bookdatarel.map(function (element, index) {
      $("#bookselect").append(new Option(element.title, element.id));
    });
    // sending the add relation request on submit
    $(".add-relation").on("submit", function (event) {
      event.preventDefault();
      let optioncatid = $('#catselect').val();
      let optionbookid = $('#bookselect').val();
      $.post("http://localhost/Ulib/BackEnd/models/Ebooks.php", { type: "relation", bookid: optionbookid, catid: optioncatid }, function (data, status) {
        // response = JSON.parse(data);
        if (data === "done") {
          console.log("done");

          $(".dash-container").removeClass("blurred");
          $.get("http://localhost/Ulib/BackEnd/models/categories.php", function (data, status) {
            catdata = JSON.parse(data);
            $(".relation-comf").css("visibility", "visible");

          });
        }

      });
    });


    $(document).ready(function () {
      // store page - adding the filters tab 
      $(".cat-filter").append(
        "<div class=catfilt id=d " + " > " + "Reset filters" + "</div >");
      $("#d").click(function () {
        $(".block-modal").remove();
        $("#table_div").remove();

        $(".book-container").empty();
        rendermain();
      });
      catdata.name.map(function (element, index) {
        $(".cat-filter").append(
          "<div class=catfilt id=c" + index + " > " + element + "</div>"
        );
        //adding the filters onclick listerners
        $("#c" + index).click(function () {
          $(".block-modal").remove();
          $("#table_div").remove();

          $(".book-container").empty();
          catdata.catid.map(function (element, index1) {

            if (index === index1) {
              console.log(element);
              renderfilters(element);
            }

          });
        });
      });
      $(".cat-add-modal-form").on("submit", function (event) {
        event.preventDefault();
        var $inputs = $('.cat-add-modal-form :input');
        var values = {};

        $inputs.each(function () {
          values[this.name] = $(this).val();
        });
        if (values.username) {
          $.post("http://localhost/Ulib/BackEnd/models/categories.php", { type: "insert", name: values.username }, function (data, status) {
            response = JSON.parse(data);
            if (response === "inserted") {
              console.log("done");
              $(".add-cat-modal").fadeOut(200);
              $(".dash-container").removeClass("blurred");
              $.get("http://localhost/Ulib/BackEnd/models/categories.php", function (data, status) {
                catdata = JSON.parse(data);
                refreshcategories();
              });
            }

          });
        } else {
          $(".cat-login-error").css("visibility", "visible");
        }

      });
      // dashboard send the add/ delete / edit ajax requests on submit
      $(".dash-cat-container").click(function () {
        refreshcategories();
        // $(".cat-add-modal-form").ubind();
        // $(".cat-add-modal-form").on("submit",function (event) {
        //   event.preventDefault();
        //   var $inputs = $('.cat-add-modal-form :input');
        //   var values = {};

        //   $inputs.each(function () {
        //     values[this.name] = $(this).val();
        //   });
        //   if (values.username) {
        //     $.post("http://localhost/Ulib/BackEnd/models/categories.php", { type: "insert", name: values.username }, function (data, status) {
        //       response = JSON.parse(data);
        //       if (response === "inserted") {
        //         console.log("done");
        //         $(".add-cat-modal").fadeOut(200);
        //         $(".dash-container").removeClass("blurred");
        //         $.get("http://localhost/Ulib/BackEnd/models/categories.php", function (data, status) {
        //           catdata = JSON.parse(data);
        //           refreshcategories();
        //         });
        //       }

        //     });
        //   } else {
        //     $(".cat-login-error").css("visibility", "visible");
        //   }

        // });
        catdata.name.map(function (element, index) {

          $("#catform" + index).submit(function (event) {
            event.preventDefault();
            var $inputs = $("#catform" + index + " :input");
            var values = {};
            var formData = new FormData();
            $inputs.each(function () {
              values[this.name] = $(this).val();
            });
            if (values.username && values.username !== undefined) {
              formData.append('name', values.username);
              formData.append('catid', catdata.catid[index]);
              formData.append('type', "edit");


              $(".cat-login-error-edit").css("visibility", "hidden");
              $.ajax({
                url: "http://localhost/Ulib/BackEnd/models/categories.php",
                type: 'POST',
                enctype: 'multipart/form-data',
                data: formData,
                cache: false,
                contentType: false,
                processData: false
              }).done(function (response) {
                $(".cat-done-edit").css("visibility", "visible");
                $(".dash-container").removeClass("blurred");
                $.get("http://localhost/Ulib/BackEnd/models/categories.php", function (data, status) {
                  catdata = JSON.parse(data);
                  refreshcategories();
                });

                $("#editc" + index).fadeOut(200);

              });

            } else {
              $(".cat-done-edit").css("visibility", "hidden");
              $(".cat-login-error-edit").css("visibility", "visible");
            }
          });
          $("#catdel" + index).on("submit", function (event) {
            event.preventDefault();
            formData = new FormData();
            formData.append('catid', catdata.catid[index]);
            formData.append('type', "delete");
            $.ajax({
              url: "http://localhost/Ulib/BackEnd/models/categories.php",
              type: 'POST',
              enctype: 'multipart/form-data',
              data: formData,
              cache: false,
              contentType: false,
              processData: false
            }).done(function (response) {
              $(".cat-done-del").css("visibility", "visible");
              $(".dash-container").removeClass("blurred");
              $("#editc" + index).fadeOut(200);
              $.get("http://localhost/Ulib/BackEnd/models/categories.php", function (data, status) {
                catdata = JSON.parse(data);
                refreshcategories();
              });
            });

          });


        });
      });

      // dashboard page => refreshes the categories compoenents on each edit/delete/add request to keep up with changes
      function refreshcategories() {
        $(".block-modal").remove();
        $("#table_div").remove();
        $(".add-cat-modal").unbind();
        $(".edit-cat-modal").remove();
        $(".edit-book-modal").remove();


        $(".dash-content-inner-container").empty();
        $(".dash-content-inner-container").append(
          "<div class=cat-content-block id=add > " +
          "<div class=cat-content-info-div-add>" +
          "<div class=add-id > Add Categories/Relations  </div>"
          + "</div>" +
          "<div class=cat-content-edit-div-button id=cat-add-btn ><img src=../assets/plus.png alt=edit=></div>" +
          "</div>"
        );
        $("#cat-add-btn").on("click", function () {
          $(".add-cat-modal").fadeToggle(200);
          $(".add-cat-modal").css("display", "flex");
          $(".dash-container").toggleClass("blurred");
          $(".cat-add-x-btn").on("click", function () {

            $(".add-cat-modal").fadeOut(200);
            $(".dash-container").removeClass("blurred");
          });
        });
        catdata.name.map(function (element, index) {

          $(".dash-content-inner-container").append(
            "<div class=cat-content-block id=f" + index + "> " +
            " <div class=cat-content-info-div>" +
            "<div class=block-cat-id> Id: " + catdata.catid[index] + "</div>" +
            "<div class=block-cat-name> Name: " + element + "</div></div>" +
            "<div class=cat-content-edit-div>" +
            "<div class=cat-content-edit-div-button id=EE" + index + "> <img src=../assets/edit.png alt = edit =></div > " +
            "</div>" +
            "</div>"
          );
          $(".container").append(
            " <div class=edit-cat-modal id=editc" + index + ">" +
            " <h1 class=edit-cat-modal-header> Edit Category</h1>" +
            " <form action=POST class=cat-edit-modal-form id=catform" + index + ">" +
            "<div class=cat-edit-close-btn>" +
            "<p class=cat-edit-x-btn>X</p>" +
            "</div>" +
            " <p>name: </p> </br>" +

            " <input type=text name=username > </input>" +

            "<p class=cat-done-edit> Insertion Successfull </p>" +
            "<p class=cat-login-error-edit> failed: Please fill all Fields</p>" +
            "<input type=submit value=submit>" +
            "</form>" +

            "<form action=POST class=cat-del-modal-form id=catdel" + index + ">" +

            "<input type=submit value=delete >" +
            "<p class=cat-done-del style=background-color:red; delete successfull </p>" +
            "</form>"
            +
            "</div>"
          );
          $("#catdel" + index).on("submit", function (event) {
            event.preventDefault();
            formData = new FormData();
            formData.append('catid', catdata.catid[index]);
            formData.append('type', "delete");
            $.ajax({
              url: "http://localhost/Ulib/BackEnd/models/categories.php",
              type: 'POST',
              enctype: 'multipart/form-data',
              data: formData,
              cache: false,
              contentType: false,
              processData: false
            }).done(function (response) {
              $(".cat-done-del").css("visibility", "visible");
              $(".dash-container").removeClass("blurred");
              $("#editc" + index).fadeOut(200);
              $.get("http://localhost/Ulib/BackEnd/models/categories.php", function (data, status) {
                catdata = JSON.parse(data);
                refreshcategories();
              });
            });

          });
          $("#EE" + index).on("click", function () {
            console.log("here");
            $("#editc" + index).css("display", "flex!important");
            $("#editc" + index).fadeToggle(200);

            $(".dash-container").toggleClass("blurred");
            $(".cat-edit-x-btn").click(function () {
              $("#editc" + index).fadeOut(200);
              $(".dash-container").removeClass("blurred");

            });
          });
          $("#catform" + index).submit(function (event) {
            event.preventDefault();
            var $inputs = $("#catform" + index + " :input");
            var values = {};
            var formData = new FormData();
            $inputs.each(function () {
              values[this.name] = $(this).val();
            });
            if (values.username && values.username !== undefined) {
              formData.append('name', values.username);
              formData.append('catid', catdata.catid[index]);
              formData.append('type', "edit");


              $(".cat-login-error-edit").css("visibility", "hidden");
              $.ajax({
                url: "http://localhost/Ulib/BackEnd/models/categories.php",
                type: 'POST',
                enctype: 'multipart/form-data',
                data: formData,
                cache: false,
                contentType: false,
                processData: false
              }).done(function (response) {
                $(".cat-done-edit").css("visibility", "visible");
                $(".dash-container").removeClass("blurred");
                $.get("http://localhost/Ulib/BackEnd/models/categories.php", function (data, status) {
                  catdata = JSON.parse(data);
                  refreshcategories();
                });

                $("#editc" + index).fadeOut(200);

              });

            } else {
              $(".cat-done-edit").css("visibility", "hidden");
              $(".cat-login-error-edit").css("visibility", "visible");
            }
          });
        });
      }


    });
  });
});




// renders the store and dashboard book pages
function rendermain() {
  $.get("http://localhost/Ulib/BackEnd/models/ebooks.php", function (data, status) {
    bookdata = JSON.parse(data);
    console.log(bookdata);
    $(document).ready(function () {

      // dashboard renders the books tab onclick
      $(".dash-book-container").click(function () {
        $(".block-modal").remove();
        $("#table_div").remove();

        $(".dash-content-inner-container").empty();
        $(".dash-content-inner-container").append(
          "<div class=cat-content-block id=add > " +
          "<div class=cat-content-info-div-add>" +
          "<div class=add-id > Add Books </div>"
          + "</div>" +
          "<div class=cat-content-edit-div-button id=book-add-btn ><img src=../assets/plus.png alt=edit=></div>" +
          "</div>"
        );
        $("#book-add-btn").on("click", function () {
          $(".add-book-modal").fadeToggle(200);
          $(".add-book-modal").css("display", "flex");
          $(".dash-container").toggleClass("blurred");
          $(".book-add-x-btn").on("click", function () {
            console.log("hi");
            $(".add-book-modal").fadeOut(200);
            $(".dash-container").removeClass("blurred");
          });
        });

        bookdata.map(function (element, index) {
          $(".container").append(
            " <div class=edit-book-modal id=edit" + index + ">" +
            " <h1 class=edit-book-modal-header> Edit Book</h1>" +
            " <form action=POST class=book-edit-modal-form id=bookform" + index + ">" +
            "<div class=book-edit-close-btn>" +
            "<p class=book-edit-x-btn>X</p>" +
            "</div>" +
            " <p>title: </p>" +
            " <input type=text name=title  > </input" +
            " <p>author: </p>" +
            "<input type=text name=author  >" +
            "<p>description: </p>" +
            "<input type=text name=description >" +
            "<p>Price: </p>" +
            "<input type=text name=Price >" +
            "<p>Book cover (.png only): </p>" +
            "<input type=file accept=image/* name=file id=edit-img-input" + index + " >" +
            "<p class=book-done-edit> Insertion Successfull</p>" +
            "<p class=book-login-error-edit> failed: Please fill all Fields</p>" +
            "<input type=submit value=submit>" +
            "</form>" +
            " <form action=POST class=book-del-modal-form id=bookdel" + index + ">" +
            "<input type=submit value=delete >" +
            "<p class=book-done-del style=background-color:red; delete successfull </p>" +
            "</form>"
            + "</div>"
          );
          $("#bookdel" + index).submit(function (event) {
            event.preventDefault();
            formData = new FormData();
            formData.append('bookid', element.id);
            formData.append('type', "delete");
            $.ajax({
              url: "http://localhost/Ulib/BackEnd/models/Ebooks.php",
              type: 'POST',
              enctype: 'multipart/form-data',
              data: formData,
              cache: false,
              contentType: false,
              processData: false
            }).done(function (response) {
              $(".book-done-del").css("visibility", "visible");
              $(".dash-container").removeClass("blurred");
              $("#edit" + index).fadeOut(200);
              $.get("http://localhost/Ulib/BackEnd/models/Ebooks.php", function (data, status) {
                bookdata = JSON.parse(data);
                refreshbook();
              });
            });

          });
          $("#bookform" + index).on("submit", function (event) {
            event.preventDefault();
            var $inputs = $("#bookform" + index + " :input");
            var values = {};
            var formData = new FormData();

            $inputs.each(function () {
              values[this.name] = $(this).val();
            });


            if (values.title && values.title !== undefined && values.author && values.author !== undefined
              && values.description && values.description !== undefined && values.Price && values.Price !== undefined && $("#edit-img-input" + index)[0].files[0] && $("#edit-img-input" + index)[0].files[0] !== undefined) {


              formData.append('title', values.title);
              formData.append('author', values.author);
              formData.append('Price', values.Price);
              formData.append('description', values.description);
              formData.append('type', "edit");
              formData.append('id', element.id);
              formData.append('file', $("#edit-img-input" + index)[0].files[0]);

              $(".book-login-error-edit").css("visibility", "hidden");
              $.ajax({
                url: "http://localhost/Ulib/BackEnd/models/Ebooks.php",
                type: 'POST',
                enctype: 'multipart/form-data',
                data: formData,
                cache: false,
                contentType: false,
                processData: false
              }).done(function (response) {
                $("#edit" + index).fadeOut(200);
                $(".dash-container").removeClass("blurred");
                $(".book-done-edit").css("visibility", "visible");
                $.get("http://localhost/Ulib/BackEnd/models/Ebooks.php", function (data, status) {
                  bookdata = JSON.parse(data);
                  refreshbook();
                });
              });
            } else {
              $(".book-done-edit").css("visibility", "hidden");
              $(".book-login-error-edit").css("visibility", "visible");
            }




          });
          $(".dash-content-inner-container").append(
            "<div class=block id=" + index + ">" +
            "<img class=block-img src=" + element.imgurl + ">" +
            "<h2 class=block-title > " + element.title + "</h2>" +
            "<div class=book-content-edit-div-button id=E" + index + "><img src=../assets/edit.png> </img> </div> </div>"
          );

          $("#E" + index).on("click", function () {
            console.log("here");
            $("#edit" + index).css("display", "flex!important");
            $("#edit" + index).fadeToggle(200);

            $(".dash-container").toggleClass("blurred");
            $(".book-edit-x-btn").click(function () {
              $("#edit" + index).fadeOut(200);
              $(".dash-container").removeClass("blurred");
            });

          });


          if (element.category !== undefined) {
            element.category.map(function (element1, index1) {
              if (index1 === 0) {
                $("#" + index).find(".block-category").append(
                  "" + element1 + " "
                );
                $("#t" + index).find(".modal-block-category").append(
                  "<span>" + element1 + " </span>"

                );
              }
              else {
                $("#" + index).find(".block-category").append(
                  " " + element1 + " "
                );
                $("#t" + index).find(".modal-block-category").append(
                  "<span>" + element1 + " </span>"

                );
              }

            });

          }
        });
        bookdata.map(function (element, index) {
          $(".book-container").children("#" + index + ".block").click(function () {
            $(" #t" + index).fadeToggle(200);
            $(" #t" + index).css("display", "flex");
            $(".book-container").toggleClass("blurred");
            $(".book-container").css("pointer-events", "none");
            $(" #t" + index + " > h1").click(function () {
              $(" #t" + index).fadeOut(200);
              $(".book-container").removeClass("blurred");
              $(".book-container").css("pointer-events", "auto");
            });

          });;
        });
      });

      // dashboard refreshes the books tab on each request to keep up with changess
      function refreshbook() {
        $(".block-modal").remove();
        $("#table_div").remove();

        $(".dash-content-inner-container").empty();

        $(".dash-content-inner-container").append(
          "<div class=cat-content-block id=add > " +
          "<div class=cat-content-info-div-add>" +
          "<div class=add-id > Add Books </div>"
          + "</div>" +
          "<div class=cat-content-edit-div-button id=book-add-btn ><img src=../assets/plus.png alt=edit=></div>" +
          "</div>"
        );
        $("#book-add-btn").on("click", function () {
          $(".add-book-modal").fadeToggle(200);
          $(".add-book-modal").css("display", "flex");
          $(".dash-container").toggleClass("blurred");
          $(".book-add-x-btn").on("click", function () {
            console.log("hi");
            $(".add-book-modal").fadeOut(200);
            $(".dash-container").removeClass("blurred");
          });
        });

        bookdata.map(function (element, index) {
          $(".container").append(
            " <div class=edit-book-modal id=edit" + index + ">" +
            " <h1 class=edit-book-modal-header> Edit Book</h1>" +
            " <form action=POST class=book-edit-modal-form id=bookform" + index + ">" +
            "<div class=book-edit-close-btn>" +
            "<p class=book-edit-x-btn>X</p>" +
            "</div>" +
            " <p>title: </p>" +
            " <input type=text name=title  > </input" +
            " <p>author: </p>" +
            "<input type=text name=author  >" +
            "<p>description: </p>" +
            "<input type=text name=description >" +
            "<p>Price: </p>" +
            "<input type=text name=Price >" +
            "<p>Book cover (.png only): </p>" +
            "<input type=file accept=image/* name=file id=edit-img-input" + index + " >" +
            "<p class=book-done-edit> Insertion Successfull</p>" +
            "<p class=book-login-error-edit> failed: Please fill all Fields</p>" +
            "<input type=submit value=submit>" +
            "</form>" +
            " <form action=POST class=book-del-modal-form id=bookdel" + index + ">" +
            "<input type=submit value=delete >" +
            "<p class=book-done-del style=background-color:red; delete successfull </p>" +
            "</form>"
            + "</div>"
          );
          $(".dash-content-inner-container").append(
            "<div class=block id=" + index + ">" +
            "<img class=block-img src=" + element.imgurl + ">" +
            "<h2 class=block-title > " + element.title + "</h2>" +
            "<div class=book-content-edit-div-button id=E" + index + "><img src=../assets/edit.png> </img> </div> </div>"
          );
          $("#E" + index).on("click", function () {
            console.log("here");
            $("#edit" + index).css("display", "flex!important");
            $("#edit" + index).fadeToggle(200);
            $(".dash-container").toggleClass("blurred");
            $(".book-edit-x-btn").click(function () {
              $("#edit" + index).fadeOut(200);
              $(".dash-container").removeClass("blurred");
            });
          });
          if (element.category !== undefined) {
            element.category.map(function (element1, index1) {
              if (index1 === 0) {
                $("#" + index).find(".block-category").append(
                  "" + element1 + " "
                );
                $("#t" + index).find(".modal-block-category").append(
                  "<span>" + element1 + " </span>"
                );
              }
              else {
                $("#" + index).find(".block-category").append(
                  " " + element1 + " "
                );
                $("#t" + index).find(".modal-block-category").append(
                  "<span>" + element1 + " </span>"
                );
              }
            });
          }

          $("#bookdel" + index).on("submit", function (event) {
            event.preventDefault();
            formData = new FormData();
            formData.append('bookid', element.id);
            formData.append('type', "delete");
            $.ajax({
              url: "http://localhost/Ulib/BackEnd/models/Ebooks.php",
              type: 'POST',
              enctype: 'multipart/form-data',
              data: formData,
              cache: false,
              contentType: false,
              processData: false
            }).done(function (response) {
              $(".book-done-del").css("visibility", "visible");
              $(".dash-container").removeClass("blurred");
              $("#edit" + index).fadeOut(200);
              $.get("http://localhost/Ulib/BackEnd/models/Ebooks.php", function (data, status) {
                bookdata = JSON.parse(data);
                refreshbook();
              });
            });

          });
          $("#bookform" + index).on("submit", function (event) {
            event.preventDefault();
            var $inputs = $("#bookform" + index + " :input");
            var values = {};
            var formData = new FormData();

            $inputs.each(function () {
              values[this.name] = $(this).val();
            });


            if (values.title && values.title !== undefined && values.author && values.author !== undefined
              && values.description && values.description !== undefined && values.Price && values.Price !== undefined && $("#edit-img-input" + index)[0].files[0] && $("#edit-img-input" + index)[0].files[0] !== undefined) {


              formData.append('title', values.title);
              formData.append('author', values.author);
              formData.append('Price', values.Price);
              formData.append('description', values.description);
              formData.append('type', "edit");
              formData.append('id', element.id);
              formData.append('file', $("#edit-img-input" + index)[0].files[0]);

              $(".book-login-error-edit").css("visibility", "hidden");
              $.ajax({
                url: "http://localhost/Ulib/BackEnd/models/Ebooks.php",
                type: 'POST',
                enctype: 'multipart/form-data',
                data: formData,
                cache: false,
                contentType: false,
                processData: false
              }).done(function (response) {
                $("#edit" + index).fadeOut(200);
                $(".dash-container").removeClass("blurred");
                $(".book-done-edit").css("visibility", "visible");
                $.get("http://localhost/Ulib/BackEnd/models/Ebooks.php", function (data, status) {
                  bookdata = JSON.parse(data);
                  refreshbook();
                });
              });
            } else {
              $(".book-done-edit").css("visibility", "hidden");
              $(".book-login-error-edit").css("visibility", "visible");
            }




          });
        });
        bookdata.map(function (element, index) {
          $(".book-container").children("#" + index + ".block").click(function () {
            $(" #t" + index).fadeToggle(200);
            $(" #t" + index).css("display", "flex");
            $(".book-container").toggleClass("blurred");
            $(".book-container").css("pointer-events", "none");
            $(" #t" + index + " > h1").click(function () {
              $(" #t" + index).fadeOut(200);
              $(".book-container").removeClass("blurred");
              $(".book-container").css("pointer-events", "auto");
            });
          });;
        });
      }

      $(".book-add-modal-form").submit(function (event) {
        event.preventDefault();
        var $inputs = $('.book-add-modal-form :input');
        var values = {};
        var formData = new FormData();

        $inputs.each(function () {
          values[this.name] = $(this).val();
        });
        if (values.title && values.title !== undefined && values.author && values.author !== undefined
          && values.description && values.description !== undefined && values.Price && values.Price !== undefined && $("#img-input")[0].files[0] && $("#img-input")[0].files[0] !== undefined) {

          formData.append('title', values.title);
          formData.append('author', values.author);
          formData.append('Price', values.Price);
          formData.append('description', values.description);
          formData.append('type', "insert");
          formData.append('file', $("#img-input")[0].files[0]);
          $(".book-login-error").css("visibility", "hidden");
          $.ajax({
            url: "http://localhost/Ulib/BackEnd/models/Ebooks.php",
            type: 'POST',
            enctype: 'multipart/form-data',
            data: formData,
            cache: false,
            contentType: false,
            processData: false
          }).done(function (response) {
            $(".book-done").css("visibility", "visible");
            $(".add-book-modal").fadeOut(200);
            $(".dash-container").removeClass("blurred");
            $.get("http://localhost/Ulib/BackEnd/models/Ebooks.php", function (data, status) {
              bookdata = JSON.parse(data);
              refreshbook();
            });
          });
        } else {
          $(".book-done").css("visibility", "hidden");
          $(".book-login-error").css("visibility", "visible");
        }
      });

      // store page adding the book components and  popups 
      bookdata.map(function (element, index) {
        $(".book-container").append(
          "<div class=block id=" + index + ">" +
          "<img class=block-img src=" + element.imgurl + " /> " +
          "<h2 class=block-title > " + element.title + "</h2>"
          +
          "</div>"
        );
        $(".store-container").append(
          "<div class=block-modal id=t" + index + "> <h1 class=block-x-btn> X </h1>" +
          "<img class=modal-block-img src=" + element.imgurl + " /> " +
          "<h2 class=modal-block-title > " + element.title + "</h2>" +
          "<h4 class=modal-block-author> " + "Author: " + element.author + "</h4>" +
          "<h4 class=modal-block-author> " + "Price: " + element.price + "$ </h4>" +
          "<h5 class=modal-block-descp > Description: " + element.description + " </h5> " +
          "<h5 class=modal-block-category>   </h5>" +
          "<div class=buy-btn > Purchase </div> </div>"
        );
        if (element.category !== undefined) {
          element.category.map(function (element1, index1) {
            if (index1 === 0) {
              $("#" + index).find(".block-category").append(
                "" + element1 + " "
              );
              $("#t" + index).find(".modal-block-category").append(
                "<span>" + element1 + " </span>"

              );
            }
            else {
              $("#" + index).find(".block-category").append(
                " " + element1 + " "
              );
              $("#t" + index).find(".modal-block-category").append(
                "<span>" + element1 + " </span>"

              );
            }

          });

        }


        // ajax edit book request
        $("#bookform" + index).submit(function (event) {
          event.preventDefault();
          var $inputs = $("#bookform" + index + " :input");
          var values = {};
          var formData = new FormData();

          $inputs.each(function () {
            values[this.name] = $(this).val();
          });


          if (values.title && values.title !== undefined && values.author && values.author !== undefined
            && values.description && values.description !== undefined && values.Price && values.Price !== undefined && $("#edit-img-input" + index)[0].files[0] && $("#edit-img-input" + index)[0].files[0] !== undefined) {


            formData.append('title', values.title);
            formData.append('author', values.author);
            formData.append('Price', values.Price);
            formData.append('description', values.description);
            formData.append('type', "edit");
            formData.append('id', element.id);
            formData.append('file', $("#edit-img-input" + index)[0].files[0]);

            $(".book-login-error-edit").css("visibility", "hidden");
            $.ajax({
              url: "http://localhost/Ulib/BackEnd/models/Ebooks.php",
              type: 'POST',
              enctype: 'multipart/form-data',
              data: formData,
              cache: false,
              contentType: false,
              processData: false
            }).done(function (response) {
              $("#edit" + index).fadeOut(200);
              $(".dash-container").removeClass("blurred");
              $(".book-done-edit").css("visibility", "visible");
              $.get("http://localhost/Ulib/BackEnd/models/Ebooks.php", function (data, status) {
                bookdata = JSON.parse(data);
                refreshbook();
              });
            });
          } else {
            $(".book-done-edit").css("visibility", "hidden");
            $(".book-login-error-edit").css("visibility", "visible");
          }




        });
      });
      // adding the popups onlclick events
      bookdata.map(function (element, index) {
        $(".book-container").children("#" + index + ".block").click(function () {
          $(" #t" + index).fadeToggle(200);
          $(" #t" + index).css("display", "flex");
          $(".book-container").toggleClass("blurred");
          $(".book-container").css("pointer-events", "none");
          $(" #t" + index + " > h1").click(function () {
            $(" #t" + index).fadeOut(200);
            $(".book-container").removeClass("blurred");
            $(".book-container").css("pointer-events", "auto");
          });

        });;
      });
    });
  });
}

rendermain();

$(document).ready(function () {
  // login popups
  $(".login").click(function () {

    $(".login-modal").fadeToggle(200);
    $(".login-modal").css("display", "flex");
    $(".container").toggleClass("blurred");
    $(".x-btn").click(function () {
      $(".login-modal").fadeOut(200);
      $(".container").removeClass("blurred");
    });

  });

  $(".dash-charts-container").click(function () {
    $(".dash-content-inner-container").empty();
    $(".dash-content-container").append(
      "<div id=table_div ></div>"
    );

    $.get("http://localhost/Ulib/BackEnd/models/numofbooks.php", function (data, status) {
      let chartdata = JSON.parse(data);
      console.log(chartdata);


      google.charts.load('current', { 'packages': ['table'] });
      google.charts.setOnLoadCallback(drawTable);
      function drawTable() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Category');
        data.addColumn('number', 'Number of Books');

        chartdata.name.map(function (element, index) {
          data.addRows([
            [element, { f: chartdata.num[index] + "" }],

          ]);

        });


        var table = new google.visualization.Table(document.getElementById('table_div'));

        table.draw(data, { showRowNumber: true, width: '800px', height: '400px', "textAlign": "center", "overflow": "scroll" });
      }
    });

  });

});
// logs in the user on submit
$(".form-login").submit(function (event) {
  event.preventDefault();
  var $inputs = $('.form-login :input');
  var values = {};

  $inputs.each(function () {
    values[this.name] = $(this).val();
  });
  // console.log(values.username + values.password + "");

  $.post("http://localhost/Ulib/BackEnd/models/admin.php", { type: "verify", username: values.username, password: values.password }, function (data, status) {
    response = JSON.parse(data);
    if (response === "valid") {
      // console.log(window.location.href);
      const full = location.protocol + '//' + location.host;

      window.location = full + "/Ulib/FrontEnd/src/pages/dashboard.html";
    }
    if (response === "notValid") {
      console.log("notValid");
      $(".login-error").css("visibility", "visible");
    }

  });
});





