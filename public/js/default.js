
$(document).ready(function() {
  $('#summernote').summernote({
    toolbar: [
      ['style', ['style']],
      ['font', ['bold', 'underline', 'clear']],
      ['color', ['color']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['table', ['table']],
      ['insert', ['link']],
      ['view', ['fullscreen', 'codeview', 'help']]
    ]
  });
});


//CODEMIRROR CONFIG
var editor = CodeMirror.fromTextArea(document.getElementById("source"), {
  lineNumbers: true,
  tabSize: 2,
  mode: "text/x-java",
  lineWrapping: true,
  matchBrackets: true,
  theme: "darcula"
  });
  if(window.location.pathname === '/ciground'){
    editor.setSize("100%", 624);
  }else{
      editor.setSize("100%", 450);
    }
    
  var textareames=document.getElementById("source").value
  if(!document.getElementById("source").value)
  {
    editor.getDoc().setValue('//Do not change the name of Main class\nclass Main {\n  public static void main(String[] args) {\n  System.out.println(\"Hello world!\");\n\t}\n};');
  
  }else{
    editor.getDoc().setValue(textareames);
  }
  
  
  
  var modeInput = document.getElementById("lang");
  function selectMode() {
  var myindex  = modeInput.selectedIndex;
  var modefly = modeInput.options[myindex].text.toLowerCase();
  switch(modefly){
      case "java":
      editor.getDoc().setValue('//Do not change the name of Main class\nclass Main {\n  public static void main(String[] args) {\n  System.out.println(\"Hello world!\");\n}};');
      editor.setOption("mode", "text/x-java");
      break;
      case "c":
      editor.getDoc().setValue('#include <stdio.h> \nint main(void) \n{ \n   printf("Hello World"); \n   return 0;\n}');
      editor.setOption("mode", "text/x-csrc");
      break;
      case "python":
      editor.getDoc().setValue('print("Hello World!")');
      editor.setOption("mode", "text/x-python");
      break;
      case "c++":
      editor.getDoc().setValue('#include <iostream>\n\nint main() {   \n  std::cout << "Hello World!";\n}');
      editor.setOption("mode", "text/x-c++src");
      break;
      case "c#":
      editor.getDoc().setValue('using System;\n\nclass MainClass {\n  public static void Main (string[] args) {\n  Console.WriteLine ("Hello World");\n}\n}');
      editor.setOption("mode", "text/x-csharp");
      break;
          
  }
  
  }

//COMPILER CONFIG!!!
var surl="https://judge0.codeit.website/submissions/"
 var language_to_id = {
     "Bash": 46,
     "C": 50,
     "C#": 51,
     "C++": 54,
     "Java": 62,
     "Python": 71,
     "Ruby": 72
 };

 function encode(str) {
     return btoa(unescape(encodeURIComponent(str || "")));
 }

 function decode(bytes) {
     var escaped = escape(atob(bytes || ""));
     try {
         return decodeURIComponent(escaped);
     } catch {
         return unescape(escaped);
     }
 }

 function errorHandler(jqXHR, textStatus, errorThrown) {
     $("#output").val(`${JSON.stringify(jqXHR, null, 4)}`);
     $("#run").prop("disabled", false);
 }

 function check(token) {
     $("#output").val($("#output").val() + "\nChecking submission status...");
     $.ajax({
       url: surl+`${token}?base64_encoded=true`, 
         type: "GET",
         success: function (data, textStatus, jqXHR) {
             if ([1, 2].includes(data["status"]["id"])) {
                 $("#output").val($("#output").val() + "\nStatus: " + data["status"]["description"]);
                 setTimeout(function() { check(token) }, 1000);
             }
             else {
                 var output = [decode(data["compile_output"]), decode(data["stdout"])].join("\n").trim();
                 $("#output").val(output);
                 $("#run").prop("disabled", false);
             }
         },
         error: errorHandler
     });
 }

 function run() {
     $("#run").prop("disabled", true);
     $("#output").val("Creating submission...");
     $.ajax({
        url: surl+`?base64_encoded=true`, 
         type: "POST",
         contentType: "application/json",
         data: JSON.stringify({
             "language_id": language_to_id[$("#lang").val()],
             "source_code": encode(editor.getValue()),
             "stdin": encode($("#input").val()),
             "redirect_stderr_to_stdout": true
         }),
         success: function(data, textStatus, jqXHR) {
             $("#output").val($("#output").val() + "\nSubmission created.");
             setTimeout(function() { check(data["token"]) }, 1000);
         },
         error: errorHandler
     });
 }

 $("body").keydown(function (e) {
     if (e.ctrlKey && e.keyCode == 13) {
         run();
     }
 });

 $("textarea").keydown(function (e) {
     if (e.keyCode == 9) {
         e.preventDefault();
         var start = this.selectionStart;
         var end = this.selectionEnd;

         var append = "    ";
         $(this).val($(this).val().substring(0, start) + append + $(this).val().substring(end));

         this.selectionStart = this.selectionEnd = start + append.length;
     }
 });

 

$("#source").focus();

