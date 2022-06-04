const SparqlClient = require("sparql-http-client");
const endpointUrl = "http://localhost:3030/matkul-ti-unpad/sparql";
const client = new SparqlClient({ endpointUrl });

module.exports = {
  index: async function (req, res, next) {
    const queryAll = `
        PREFIX course: <https://informatika.unpad.ac.id/course#> 
        PREFIX lecturer:  <https://informatika.unpad.ac.id/lecturer#> 
        PREFIX data:  <https://example.org/> 
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 

        SELECT DISTINCT ?name ?abbreviation ?code ?type ?field ?ct_abbrev ?semester ?curriculum ?sks ?prerequisite ?lecturer ?lecturer_nidn ?class 
        WHERE {
            ?course  data:name ?name;
            data:code ?code;
            data:type ?ct;
            data:semester ?semester;
            data:curriculum ?curriculum;
            data:sks ?sks.
            ?ct data:name ?type;
                data:field ?field;
                data:abbreviation ?ct_abbrev.

            OPTIONAL
            {
            ?course data:abbreviation ?abbreviation.
            }
            OPTIONAL
            {
            ?course data:prerequisite ?course1.
            ?course1 data:code ?prerequisite.
            }
            OPTIONAL
            {
            ?course data:lecturer [
                ?class1 ?lecturer1
            ].
            ?class1 data:name ?class.
            ?lecturer1 data:name ?lecturer.
                OPTIONAL{
                ?lecturer1 data:nidn ?lecturer_nidn.
                }
            }
            }  ORDER BY ?semester ?name
            `;

    // if (req.query.search) {
    //   const querySearch = `
    //   PREFIX course: <https://informatika.unpad.ac.id/course#>
    //   PREFIX lecturer:  <https://informatika.unpad.ac.id/lecturer#>
    //   PREFIX data:  <https://example.org/>
    //   PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    //   SELECT ?name ?code ?type ?field ?semester ?curriculum ?sks ?prerequisite ?lecturer ?lecturer_nidn ?class
    //   WHERE {
    //       ?course  data:name ?name;
    //       data:code ?code;
    //       data:type ?ct;
    //       data:semester ?semester;
    //       data:curriculum ?curriculum;
    //       data:sks ?sks.
    //       ?ct data:name ?type;
    //           data:field ?field;
    //           data:abbreviation ?ct_abbrev;

    //       OPTIONAL
    //       {
    //       ?course data:abbreviation ?abbreviation.
    //       }
    //       OPTIONAL
    //       {
    //       ?course data:prerequisite ?course1.
    //       ?course1 data:code ?prerequisite.
    //       }
    //       OPTIONAL
    //       {
    //       ?course data:lecturer [
    //           ?class1 ?lecturer1
    //       ].
    //         ?class1 data:name ?class.
    //       ?lecturer1 data:name ?lecturer.
    //           OPTIONAL{
    //           ?lecturer1 data:nidn ?lecturer_nidn.
    //           }
    //       }
    //         FILTER (regex(?name, ${req.query.search}, "i") || regex(?code, ${req.query.search}, "i") || regex(?type, ${req.query.search}, "i") || regex(?field, ${req.query.search}, "i") || regex(?lecturer, ${req.query.search}, "i") || regex(?lecturer_nidn, ${req.query.search}, "i") || regex(?abbreviation, ${req.query.search}, "i") || regex(?ct_abbrev, ${req.query.search}, "i"))
    //       } ORDER BY ?semester
    //         `;
    // }

    const stream = await client.query.select(queryAll);
    var data = [];

    stream
      .on("data", (row) => {
        let abbreviation = row.abbreviation;
        let prerequisite = row.prerequisite;
        let lecturer = row.lecturer;
        let lecturer_nidn = row.lecturer_nidn;

        let temp = {
          name: row.name.value,
          abbreviation: null,
          code: row.code.value,
          type: row.type.value,
          field: row.field.value,
          field_abbrev: row.ct_abbrev.value,
          semester: row.semester.value,
          curriculum: row.curriculum.value,
          sks: row.sks.value,
          prerequisite: null,
          lecturer: null,
          lecturer_nidn: null,
          class: null,
        };

        if (abbreviation) temp.abbreviation = row.abbreviation.value;
        if (prerequisite) temp.prerequisite = row.prerequisite.value;
        if (lecturer) {
          temp.lecturer = row.lecturer.value;
          temp.class = row.class.value;
        }
        if (lecturer_nidn) temp.lecturer_nidn = row.lecturer_nidn.value;

        data.push(temp);
      })
      .on("end", () => {
        let result = [];
        data.forEach((datum) => {
          let index = result.findIndex((x) => x.code == datum.code);
          let temp = {
            name: datum.name,
            abbreviation: datum.abbreviation,
            code: datum.code,
            type: datum.type,
            field: datum.field,
            field_abbrev: datum.field_abbrev,
            semester: datum.semester,
            curriculum: datum.curriculum,
            sks: datum.sks,
            prerequisite: datum.prerequisite,
            lecturer: null,
          };
          if (datum.lecturer != null) {
            temp["lecturer"] = {
              lecturer1: {
                name: datum.lecturer,
                nidn: datum.lecturer_nidn,
                class: datum.class,
              },
            };
          }

          if (index === -1) result.push(temp);
          else {
            if (result[index].lecturer == null) {
              result[index]["lecturer"] = {
                lecturer1: {
                  name: datum.lecturer,
                  nidn: datum.lecturer_nidn,
                  class: datum.class,
                },
              };
            } else {
              let i = 1;
              let helper = "lecturer" + i;
              // console.log(typeof result[index]["lecturer"][helper]);
              while (typeof result[index]["lecturer"][helper] == "object") {
                i++;
                helper = "lecturer" + i;
              }
              result[index]["lecturer"][helper] = {
                name: datum.lecturer,
                nidn: datum.lecturer_nidn,
                class: datum.class,
              };
            }
          }
        });
        // res.json([result]);
        res.render("index", {
          title: "Mata Kuliah TI Unpad",
          data: result,
        });
      });
  },
};
