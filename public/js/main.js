function format(rowIdx) {
  var table = $("#dt-main").DataTable();
  let prasyarat = table.rows(rowIdx).data()[0][10];
  if (prasyarat == "") prasyarat = "-";

  let dosen1 = table.rows(rowIdx).data()[0][11];
  let dosen2 = table.rows(rowIdx).data()[0][12];
  let dosen3 = table.rows(rowIdx).data()[0][13];
  let dosen4 = table.rows(rowIdx).data()[0][14];
  if (dosen1 == "") {
    return (
      '<table cellpadding="5" cellspacing="0" border="none" class="table-child" style="padding-left:50px;">' +
      '<tr class="table-child">' +
      "<td>Prasyarat: " +
      prasyarat +
      "</td>" +
      "</tr>" +
      '<tr class="table-child">' +
      "<td>Dosen: -</td>" +
      "</tr>" +
      "<tr>" +
      "<td>" +
      "</table>"
    );
  } else if (dosen2 == "") {
    return (
      '<table cellpadding="5" cellspacing="0" border="none" class="table-child" style="padding-left:50px;">' +
      '<tr class="table-child">' +
      "<td>Prasyarat: " +
      prasyarat +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td>Dosen</td>" +
      "</tr>" +
      "<tr>" +
      "<td>" +
      table.rows(rowIdx).data()[0][11] +
      "</td>" +
      "</tr>" +
      "</table>"
    );
  } else if (dosen3 == "") {
    return (
      '<table cellpadding="5" cellspacing="0" border="none" class="table-child" style="padding-left:50px;">' +
      '<tr class="table-child">' +
      "<td>Prasyarat: " +
      prasyarat +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td>Dosen</td>" +
      "</tr>" +
      "<tr>" +
      "<td>" +
      table.rows(rowIdx).data()[0][11] +
      "</td>" +
      "</tr>" +
      '<tr class="table-child">' +
      "<td>" +
      table.rows(rowIdx).data()[0][12] +
      "</td>" +
      "</tr>" +
      "</table>"
    );
  } else if (dosen4 == "") {
    return (
      '<table cellpadding="5" cellspacing="0" class="table-child" style="padding-left:50px;">' +
      '<tr class="table-child">' +
      "<td>Prasyarat: " +
      prasyarat +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td>Dosen</td>" +
      "</tr>" +
      "<tr>" +
      "<td>" +
      table.rows(rowIdx).data()[0][11] +
      "</td>" +
      "</tr>" +
      '<tr class="table-child">' +
      "<td>" +
      table.rows(rowIdx).data()[0][12] +
      "</td>" +
      "</tr>" +
      '<tr class="table-child">' +
      "<td>" +
      table.rows(rowIdx).data()[0][13] +
      "</td>" +
      "</tr>" +
      "</table>"
    );
  } else
    return (
      '<table cellpadding="5" cellspacing="0" border="none" class="table-child" style="padding-left:50px;">' +
      '<tr class="table-child">' +
      "<td>Prasyarat: " +
      prasyarat +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td>Dosen</td>" +
      "</tr>" +
      "<tr>" +
      "<td>" +
      table.rows(rowIdx).data()[0][11] +
      "</td>" +
      "</tr>" +
      '<tr class="table-child">' +
      "<td>" +
      table.rows(rowIdx).data()[0][12] +
      "</td>" +
      "</tr>" +
      '<tr class="table-child">' +
      "<td>" +
      table.rows(rowIdx).data()[0][13] +
      "</td>" +
      "</tr>" +
      '<tr class="table-child">' +
      "<td>" +
      table.rows(rowIdx).data()[0][14] +
      "</td>" +
      "</tr>" +
      "</table>"
    );
}

$(document).ready(function () {
  var table = $("#dt-main").DataTable({
    dom: "Plftip",
    columnDefs: [
      {
        className: "dt-control",
        orderable: false,
        data: null,
        defaultContent: "",
        target: [0],
      },
      {
        target: [2, 5, 10, -1, -2, -3, -4],
        visible: false,
      },
    ],
    searchPanes: {
      controls: false,
      columns: [4, 6, 7, 8, 9],
      viewTotal: true,
      layout: "columns-5",
      initCollapsed: true
    },
    keys: true,
    fixedHeader: true,
    "order": [[ 1, "asc" ], [ 7, "asc" ]],
  });

  table.rows().every(function (rowIdx) {
    this.child($(format(rowIdx))).show();
  });

  $("#expand-child").on("click", function () {
    let shown;
    table.rows().every(function (rowIdx) {
      var tr = $(this).closest("tr");

      if (this.child.isShown()) {
        // This row is already open - close it
        this.child.hide();
        tr.removeClass("shown");
        shown = 0;
      } else {
        // Open this row (the format() function would return the data to be shown)
        this.child(format(rowIdx)).show();
        tr.addClass("shown");
        shown = 1;
      }
    });
    if (shown) {
      this.innerHTML = '<i class="fa fa-chevron-circle-up"></i>';
    } else { this.innerHTML = '<i class="fa fa-chevron-circle-down"></i>';
    }
  });

  $("#dt-main tbody").on("click", "td.dt-control", function () {
    var tr = $(this).closest("tr");
    var row = table.row(tr);

    if (row.child.isShown()) {
      // This row is already open - close it
      row.child.hide();
      tr.removeClass("shown");
    } else {
      // Open this row (the format() function would return the data to be shown)
      row.child(format(tr)).show();
      tr.addClass("shown");
    }
  });
});
