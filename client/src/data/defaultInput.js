const cppCode = '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\tcout << "Hello World!";\n\treturn 0;\n}'
const cCode = '#include <stdio.h>\n\nint main() {\n\tprintf("Hello World!");\n\treturn 0;\n}'
const jsCode = 'console.log("Hello World!");'
const pythonCode = 'print("Hello World!")'
const javaCode = 'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World!");\n\t}\n}'

const defaultInput = {
    'cpp': cppCode,
    'c': cCode,
    'javascript': jsCode,
    'python3': pythonCode,
    'java': javaCode
}

export default defaultInput;