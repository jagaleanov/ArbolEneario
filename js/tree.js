// JavaScript Document

class Node {
    value;
    parent;
    type;
    right;
    down;


    constructor(value) {
        this.value = value;
        this.parent = null;
        this.type = null;
        this.right = null;
        this.down = null;
    }
}

class Tree {

    head;
    tableData;
    lineCounter;
    wordsList;
    preOrder = '';
    inOrder = '';
    posOrder = '';

    constructor() {

        this.head = new Node(null);
        this.head.down = new Node('}');
        this.tableData = [[]];
        this.lineCounter = 0;
        this.wordsList = [];
        this.treeToMatrix(this.head);
        this.completeMatrix();

    }

    //ADD TO TREE
    addRight(head, char) {
        if (head != null) {

            if (head.value == '}' || head.value.charCodeAt(0) > char.charCodeAt(0)) {
                let newNode = new Node(char);
                head.parent = newNode;
                head.type = 'right';
                newNode.right = head;
                return newNode;

            } else {
                let node = head;
                while (node.right != null && node.right.value.charCodeAt(0) < char.charCodeAt(0)) {
                    node = node.right;
                }
                let newNode = new Node(char);

                if (newNode.right != null) {
                    node.right.parent = newNode;
                    node.right.type = 'right';
                }
                newNode.right = node.right;
                node.right = newNode;
                newNode.parent = node;
                newNode.type = 'right';
                return head;
            }
        } else {
            return new Node(char);
        }
    }

    addWordRecursive(head, word) {
        if (word.length == 0) {//si acabo la palabra
            head.down = this.addRight(head.down, '}');
            head.down.parent = head;
            head.down.type = 'down';
        } else {
            let node = head.down;
            if (node == null) {//si no hay mas letras debajo
                head.down = this.addRight(null, word.charAt(0));
                head.down.parent = head;
                head.down.type = 'down';
                head = this.addWordRecursive(head, word);
            } else if (node.value == word.charAt(0)) {//si la letra de abajo coincide
                node = this.addWordRecursive(node, word.substring(1));
            } else {
                while (node.right != null && node.right.value != word.charAt(0)) {
                    node = node.right;
                }

                if (node.right != null) {
                    node.right = this.addWordRecursive(node.right, word.substring(1));
                    node.right.parent = node;
                    node.right.type = 'right';
                } else {
                    head.down = this.addRight(head.down, word.charAt(0));
                    head.down.parent = head;
                    head.down.type = 'down';
                    head = this.addWordRecursive(head, word);
                }
            }
        }

        return head;
    }

    addWord(word) {
        if (!this.wordsList.includes(word)) {
            this.head = this.addWordRecursive(this.head, word);
            this.tableData = [[]];
            this.lineCounter = 0;
            this.treeToMatrix(this.head);
            this.completeMatrix();
            this.wordsList.push(word);
            this.preOrder = '';
            this.setPreOrder(this.head);
            this.inOrder = '';
            this.setInOrder(this.head);
            this.posOrder = '';
            this.setPosOrder(this.head);
        } else {
            alert("la palabra ya se encuentra en el árbol.");
        }
    }

    //CREATE HTML
    setChar(char, charCounter, dir) {
        while (this.tableData[this.lineCounter].length - 1 < charCounter * 2) {
            this.tableData[this.lineCounter].push('');
        }

        if (dir == 'right') {
            let lineFrom = null;
            for (let i = 1; i < this.lineCounter; i++) {
                while (this.tableData[i].length - 1 < charCounter * 2) {
                    this.tableData[i].push('');
                }
                if (this.tableData[i][charCounter * 2] != '') {
                    lineFrom = i;
                }
            }

            for (let i = lineFrom + 1; i < this.lineCounter; i++) {
                this.tableData[i][charCounter * 2] = '--';
            }

        } else if (dir == 'down') {
            this.tableData[this.lineCounter][(charCounter * 2) - 1] = '||';
        }

        this.tableData[this.lineCounter][charCounter * 2] = char;
    }

    addLine() {
        this.tableData.push([]);
        this.tableData.push([]);

        this.lineCounter++;
        this.lineCounter++;
    }

    treeToMatrix(head, charCounter = 0, dir = 'head') {

        if (head.value == null) {
            this.tableData.push([]);
        }

        this.setChar((head.value == null ? '?' : head.value), charCounter, dir);

        if (head.down != null) {
            this.treeToMatrix(head.down, charCounter + 1, 'down');
        }

        if (head.right != null) {
            this.addLine();
            this.treeToMatrix(head.right, charCounter, 'right');
        }

    }

    completeMatrix() {
        let counter = 0;

        for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].length > counter) {
                counter = this.tableData[i].length;
            }
        }

        for (let i = 0; i < this.tableData.length; i++) {
            while (this.tableData[i].length < counter) {
                this.tableData[i].push('');
            }
        }


    }

    getMatrixHTML() {
        let html = '';

        for (let i = 0; i < this.tableData[0].length; i++) {
            html += '<tr>';
            for (let j = 0; j < this.tableData.length; j++) {

                if (this.tableData[j][i] == '||') {
                    html += '<td class="verticalLine">&nbsp;</td>';
                } else if (this.tableData[j][i] == '--') {
                    html += '<td class="horizontalLine">&nbsp;</td>';
                } else if (this.tableData[j][i] != '') {
                    html += '<td class="node badge badge-pill badge-primary">' + this.tableData[j][i] + '</td>';
                } else {
                    html += '<td class="empty">&nbsp;</td>';
                }

            }
            html += '</tr>';
        }

        return html;
    }

    getListHTML() {
        let html = '<ul>';
        for (let i = 0; i < this.wordsList.length; i++) {
            html += '<li>' + this.wordsList[i] + '</li>';
        }
        html += '</ul>';

        return html;
    }

    //RECORRIDOS
    setPreOrder(head) {
        if (head != null) {
            //Raiz
            this.preOrder += (head.value == null ? '?' : head.value);

            //Izq
            this.setPreOrder(head.down);

            //Der
            let temp = head.down;
            if (temp != null) {
                while (temp.right != null) {
                    this.setPreOrder(temp.right);
                    temp = temp.right;
                }
            }

        }

    }
    setInOrder(head) {
        if (head != null) {
            this.setInOrder(head.down);
            this.inOrder += (head.value == null ? '?' : head.value);
            let temp = head.down;
            if (temp != null) {
                while (temp.right != null) {
                    this.setInOrder(temp.right);
                    temp = temp.right;
                }
            }
        }

    }
    setPosOrder(head) {
        if (head != null) {
            
            this.setPosOrder(head.down);

            let temp = head.down;
            if (temp != null) {
                while (temp.right != null) {
                    this.setPosOrder(temp.right);
                    temp = temp.right;
                }
            }
            this.posOrder += (head.value == null ? '?' : head.value);
        }
    }
        //RESTART
        restart() {
            this.tableData = [[]];
            this.lineCounter = 0;
            this.wordsList = [];
            this.head = new Node(null);
            this.head.down = new Node('}');
            this.treeToMatrix(this.head);
            this.completeMatrix();
        }
    }

let tree = new Tree();
$('#tableTree').html(tree.getMatrixHTML());
$('#wordTxt').focus();

function addWord() {
    if ($('#wordTxt').val().length > 0) {
        tree.addWord($('#wordTxt').val());
        $('#tableTree').html(tree.getMatrixHTML());
        $('#wordsList').html(tree.getListHTML());
        $('#preSpan').html(tree.preOrder);
        $('#inSpan').html(tree.inOrder);
        $('#posSpan').html(tree.posOrder);

    } else {
        alert('ingrese una palabra válida');
    }

    $('#wordTxt').val('');
    $('#wordTxt').focus();
}

function reset() {
    if (confirm("Desea reiniciar el árbol")) {
        tree.restart();
        $('#tableTree').html(tree.getMatrixHTML());
        $('#wordsList').html('');
        $('#wordTxt').val('');
        $('#wordTxt').focus();
    }
}
