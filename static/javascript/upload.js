const dropArea = document.getElementById('drop-area');



dropArea.addEventListener('dragover', (event) => {
    event.stopPropagation();
    event.preventDefault();
    // Style the drag-and-drop as a "copy file" operation.
    event.dataTransfer.dropEffect = 'copy';
  });
  
  dropArea.addEventListener('drop', (event) => {
    event.stopPropagation();
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    if (!validateType(fileList)) return null;
  // alert(fileList[0]);
    readFile(fileList[0]);
  });
  
  function validateType(fileList) {
    for (const file of fileList) {
      const type = file.type
      if (type != 'text/plain') {
        alert("Only .txt files are supported");
        return false;
      } else {
        return true;
      }
    }
  };

function readFile(file) {
    const reader = new FileReader();
    const separator = '\n';
  
    reader.onload = function(event) {
      var contents = event.target.result;
      const notes = contents.split(separator);

      let  current_row= 0;

      const parsed = notes.map(note => {
        var attributes = note.split("|");
        var cleanedUpAttributes = attributes.filter(attr => attr !== "\r" && attr !== '');
        let tableID='setTable';
        let tableRef = document.getElementById(tableID);
        let rows=0;
        let cols=0;
        let cell_rows=0;
        let cell_cols=0;
        if (cleanedUpAttributes!='')
        {
///
           let vacia = 0;
            while (vacia == 0)
            {

              rows = tableRef.rows.length;
              cols = tableRef.rows[0].cells.length;
              cell_rows  = rows - 2;
              cell_cols = cols - 1;
              if (current_row==cell_rows)
              {
            //    console.log('current_row==cell_rows, agregaremos fila');
                addRow(tableID);
                rows = tableRef.rows.length;
                cols = tableRef.rows[0].cells.length;
                cell_rows  = rows - 2;
                cell_cols = cols - 1;
              }
              else
              {
                 // console.log('Analizamos fila actual' + current_row);
                  cleanedUpAttributes.forEach(function (att) { 
                    let i = 0;
                    vacia = 1;
                    if (i<cell_cols)
                    {
                        let cellName = 'cell[' +  Number(current_row) +'][' + i + ']';
                    //    console.log('Cellname:' + cellName);
                        let cellInput =  document.getElementsByName(cellName)[0];
                        if(!cellInput.value=='')
                        {
                          vacia = 0;
                        }
                    }
                    i++;

                  });

                  if(!(vacia==1))
                  {
                    // console.log('no está vacía:'+current_row);
                    current_row++;
                  }
               }
            }
///
      /*      addRow(tableID);
            let rows = tableRef.rows.length;
            let cols = tableRef.rows[0].cells.length;

            let cell_rows  = rows - 2;
            let cell_cols = cols - 1;

            let i = 0;
            console.log('cell_rows:'+cell_rows);
            console.log('cell_cols:'+cell_cols);
*/
            let i = 0;
            cleanedUpAttributes.forEach(function (att) {
                if (i<cell_cols)
                {
                    let cellName = 'cell[' +  Number(current_row) +'][' + i + ']';
                    let cellInput =  document.getElementsByName(cellName)[0];
                    cellInput.value+=att;
                }
                i++;
  
            });


        }

      }).filter(value => value);
  
      // TODO: Handle errors
      // TODO: Handle other languages? Check how Kindle behaves when other system languages are used
      // TODO: Generate CSV and/or Markdown
    };
  
    reader.readAsText(file);
  }
  