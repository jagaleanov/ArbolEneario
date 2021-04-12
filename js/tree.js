// JavaScript Document

class Node {
    value;
    parent;
    type;
    right;
    down;
    wordTr;


    constructor(value, wordTr = '') {
        this.value = value;
        this.parent = null;
        this.type = null;
        this.right = null;
        this.down = null;
        this.wordTr = wordTr;


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
    wordTr;

    constructor() {

        this.head = new Node(null);
        this.head.down = new Node('}');
        this.tableData = [[]];
        this.lineCounter = 0;
        this.wordsList = [];
        this.treeToMatrix(this.head);
        this.completeMatrix();
        this.wordTr = '';

    }

    //ADD TO TREE
    addRight(head, char) {
        if (head != null) {

            if (head.value == '}' || head.value.charCodeAt(0) > char.charCodeAt(0)) {
                let newNode = new Node(char, this.wordTr);
                head.parent = newNode;
                head.type = 1;
                newNode.right = head;
                return newNode;

            } else {
                let node = head;
                while (node.right != null && node.right.value.charCodeAt(0) < char.charCodeAt(0)) {
                    node = node.right;
                }
                let newNode = new Node(char, this.wordTr);
                if (newNode.right != null) {
                    node.right.parent = newNode;
                    node.right.type = 1;
                }
                newNode.right = node.right;
                node.right = newNode;
                newNode.parent = node;
                newNode.type = 1;
                return head;
            }
        } else {
            return new Node(char, this.wordTr);
        }
    }

    addWordRecursive(head, word) {
        if (word.length == 0) {//si acabo la palabra
            head.down = this.addRight(head.down, '}');
            head.down.parent = head;
            head.down.type = 0;
        } else {
            let node = head.down;
            if (node == null) {//si no hay mas letras debajo
                head.down = this.addRight(null, word.charAt(0));
                head.down.parent = head;
                head.down.type = 0;
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
                    node.right.type = 1;
                } else {
                    head.down = this.addRight(head.down, word.charAt(0));
                    head.down.parent = head;
                    head.down.type = 0;
                    head = this.addWordRecursive(head, word);
                }
            }
        }

        return head;
    }

    addWord(word, wordTr) {
        if (!this.wordsList.includes(word)) {
            this.wordTr = wordTr;
            this.head = this.addWordRecursive(this.head, word);
            this.tableData = [[]];
            this.lineCounter = 0;
            this.treeToMatrix(this.head);
            this.completeMatrix();
            this.wordsList.push(word);
            this.wordsList.sort();
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

    //DEL WORD
    delWordRecursive(head, word) {
        if (word.length == 0) {
            return [head, true];
        } else if (head.value == null) {
            let res = this.delWordRecursive(head.down, word);
            if (res[1]) {
                if (head.down != null) {
                    head.down = head.down.right;
                    if (head.down != null) {
                        head.down.parent = head;
                        head.down.type = 0;
                    }
                }
                return [head, true];

            } else {
                head.down = res[0];
                return [head, false];
            }
        } else if (head.value == word.charAt(0)) {
            let res = this.delWordRecursive(head.down, word.substring(1));
            if (res[1]) {
                if (head.down != null) {
                    head.down = head.down.right;
                    if (head.down != null) {
                        head.down.parent = head;
                        head.down.type = 0;
                        return [head, false];
                    } else {
                        return [head, true];

                    }
                } else {
                    return [head, true];
                }

            } else {
                head.down = res[0];
                return [head, false];
            }

        } else {
            let res = this.delWordRecursive(head.right, word);
            head.right = res[0];

            if (res[1]) {
                head.right = head.right.right;

                if (head.right != null) {
                    head.right.parent = head;
                }
                return [head, false];

            } else {
                head.right = res[0];
                return [head, false];
            }
        }
    }

    delWord(word) {
        let res = this.delWordRecursive(this.head, word + '}');
        this.head = res[0];
        this.tableData = [[]];
        this.lineCounter = 0;
        this.treeToMatrix(this.head);
        this.completeMatrix();
        let temp = [];
        for (let i = 0; i < this.wordsList.length; i++) {
            if (this.wordsList[i] != word) {
                temp.push(this.wordsList[i]);
            }
        }
        this.wordsList = temp;
        this.preOrder = '';
        this.setPreOrder(this.head);
        this.inOrder = '';
        this.setInOrder(this.head);
        this.posOrder = '';
        this.setPosOrder(this.head);
    }

    //CREATE HTML
    setChar(node, charCounter, dir) {
        let data = {};
        data.value = null;
        while (this.tableData[this.lineCounter].length - 1 < charCounter * 2) {
            this.tableData[this.lineCounter].push(data);
        }

        if (dir == 1) {
            let lineFrom = null;
            for (let i = 1; i < this.lineCounter; i++) {
                while (this.tableData[i].length - 1 < charCounter * 2) {
                    this.tableData[i].push({ data });
                }
                if (this.tableData[i][charCounter * 2].value != null) {
                    lineFrom = i;
                }
            }

            for (let i = lineFrom + 1; i < this.lineCounter; i++) {
                data = {};
                data.value = '--';
                this.tableData[i][charCounter * 2] = data;
            }

        } else if (dir == 0) {

            let data = {};
            data.value = '||';
            this.tableData[this.lineCounter][(charCounter * 2) - 1] = data;
        }

        data = {};
        data.value = (node.value == null ? '?' : node.value);
        data.wordTr = node.wordTr;

        this.tableData[this.lineCounter][charCounter * 2] = data;
    }

    addLine() {
        this.tableData.push([]);
        this.tableData.push([]);

        this.lineCounter++;
        this.lineCounter++;
    }

    treeToMatrix(head, charCounter = 0, dir = null) {

        if (head.value == null) {
            this.tableData.push([]);
        }
        //
        this.setChar(head, charCounter, dir);

        if (head.down != null) {
            this.treeToMatrix(head.down, charCounter + 1, 0);
        }

        if (head.right != null) {
            this.addLine();
            this.treeToMatrix(head.right, charCounter, 1);
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
                let data = {};
                data.value = null;
                this.tableData[i].push(data);
            }
        }


    }

    getMatrixHTML() {
        let html = '';
        let data = {};
        for (let i = 0; i < this.tableData[0].length; i++) {
            html += '<tr>';
            for (let j = 0; j < this.tableData.length; j++) {

                if (this.tableData[j][i].value == '||') {
                    html += '<td class="verticalLine">&nbsp;</td>';
                } else if (this.tableData[j][i].value == '--') {
                    html += '<td class="horizontalLine">&nbsp;</td>';
                } else if (this.tableData[j][i].value == '}') {
                    html += '<td><div class="node node_key"><strong>' + this.tableData[j][i].value +  '</strong> ' + this.tableData[j][i].wordTr + '</div></td>';
                } else if (this.tableData[j][i].value != null) {
                    html += '<td><div class="node"><strong>' + this.tableData[j][i].value + '</strong></div></td>';
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
    if ($('#wordTxt').val().length > 0 && $('#wordTrTxt').val().length > 0) {
        tree.addWord($('#wordTxt').val(), $('#wordTrTxt').val());
        $('#tableTree').html(tree.getMatrixHTML());
        $('#wordsList').html(tree.getListHTML());
        selectList();
        $('#preSpan').html(tree.preOrder);
        $('#inSpan').html(tree.inOrder);
        $('#posSpan').html(tree.posOrder);
        $('#wordTxt').val('');
        $('#wordTrTxt').val('');

    } else {
        alert('ingrese una palabra y su traducción');
    }

    $('#wordTxt').focus();
}

function selectList() {
    $('#delSel').empty();
    $('#delSel').append('<option value="" >--</option>');
    for (let i = 0; i < tree.wordsList.length; i++) {
        $('#delSel').append('<option value="' + tree.wordsList[i] + '" >' + tree.wordsList[i] + '</option>');
        //$('#delSel').append($("<option></option>")).attr("value", tree.wordsList[i]).text(tree.wordsList[i]);

    }
}

function delWord() {
    if (confirm("Desea eliminar la palabra " + $('#delSel').val())) {
        tree.delWord($('#delSel').val());
        $('#tableTree').html(tree.getMatrixHTML());
        $('#wordsList').html(tree.getListHTML());
        selectList();
        $('#preSpan').html(tree.preOrder);
        $('#inSpan').html(tree.inOrder);
        $('#posSpan').html(tree.posOrder);
    }
}

function reset() {
    if (confirm("Desea reiniciar el árbol")) {
        tree.restart();
        $('#tableTree').html(tree.getMatrixHTML());
        $('#wordsList').html('');
        selectList();
        $('#wordTxt').val('');
        $('#wordTxt').focus();
    }
}
