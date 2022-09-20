let r = document.querySelector(':root');


class ExerciseElement {
    constructor() {
    }

    get_html() {
        return "<div></div>";
    }
}

class Equal extends ExerciseElement{
    constructor() {
        super();
    }

    get_html() {
        return "<div class='equals'></div>";
    }
}

class Skalar extends ExerciseElement{
    constructor() {
        super();
    }

    get_html() {
        return "<div class='skalarproduct'></div>";
    }
}

class Cross extends ExerciseElement{
    constructor() {
        super();
    }

    get_html() {
        return "<div class='crossproduct'></div>";
    }
}

class Vector extends ExerciseElement{
    constructor(elements, is_solution) {
        super();
        this.is_solution = is_solution;
        this.dimension = elements.length;
        this.contents = elements;
    }

    get_html() {
        let all_children;
        if (this.is_solution) {
            all_children = "<div class=\"solution vector\">\n";
        } else {
            all_children = "<div class=\"vector\">\n";
        }
        for (let number of this.contents) {
            all_children += `<p>${number}</p>\n`;
        }
        all_children += "</div>";
        return all_children;
    }
}

class SkalarResuls extends ExerciseElement{
    constructor(value) {
        super();
        this.is_solution = true;
        this.value = value;
    }

    get_html() {
        let string = `<div class="solution skalar-res">${this.value}</div>`
        return string;
    }
}

class Exercise{
    constructor(dimension) {
        this.dimension = dimension
        this.elements = [];
        this.vectors = [];
    }

    get_random_value() {
        let min = 1;
        let max = 10;
        let rand = Math.random() * (max - min) + min
        return Math.floor(rand);
    }

    get_random_vector(is_solution) {
        let numbers = []
        for (let i=0; i<this.dimension; i++) {
            numbers.push(this.get_random_value())
        }

        return new Vector(numbers, is_solution);
    }

    add_random_vector(is_solution) {
        let new_vector = this.get_random_vector(is_solution);
        this.elements.push(new_vector);
        this.vectors.push(new_vector);
    }

    add_equal() {
        this.elements.push(new Equal());
    }

    get_inner_html() {
        let inner_html = "";
        for (let elem of this.elements.values()) {
            inner_html += elem.get_html();
            inner_html += "\n";
        }
        return inner_html
    }
}

class Scalarprodukt extends Exercise{
    constructor(dimension) {
        super(dimension);
        this.add_random_vector(false);
        this.elements.push(new Skalar());
        this.add_random_vector(false);
        this.add_equal();
        this.elements.push(this.calculate());
    }

    calculate() {
        let total_sum = 0;
        for (let i=0; i<this.dimension; i++) {
            let total_multiplication = 1;
            for (let vector of this.vectors) {
                total_multiplication = total_multiplication * vector.contents[i];
            }
            total_sum += total_multiplication;
            console.log(total_multiplication);
        }

        return new SkalarResuls(total_sum);
    }
}

class Crossproduct extends Exercise{
    constructor(dimension) {
        super(dimension);
        this.add_random_vector(false);
        this.elements.push(new Cross());
        this.add_random_vector(false);
        this.add_equal();
        this.elements.push(this.calculate());
    }

    calculate() {
        if (this.dimension !== 3) {
            return new Vector(new Array(this.dimension).fill("unknown"), true)
        }

        let vec_1 = this.vectors[0].contents
        let vec_2 = this.vectors[1].contents

        let result = [
            vec_1[1] * vec_2[2] - vec_1[2] * vec_2[1],
            vec_1[2] * vec_2[0] - vec_1[0] * vec_2[2],
            vec_1[0] * vec_2[1] - vec_1[1] * vec_2[0]
        ];

        return new Vector(result, true);
    }
}

function generate_new(dimensions) {
    let skalarprodukt = new Scalarprodukt(dimensions);
    let skalarprodukt_container = document.getElementById("skalar-container");
    skalarprodukt_container.innerHTML = skalarprodukt.get_inner_html();
    console.log(skalarprodukt.get_inner_html());

    let crossprodukt = new Crossproduct(3);
    let crossprodukt_container = document.getElementById("cross-container");
    crossprodukt_container.innerHTML = crossprodukt.get_inner_html();
    console.log(crossprodukt.get_inner_html());
}


function on_submit(form_element) {
    const dimensions = parseInt(document.getElementById("dimensions").value);
    console.log(dimensions)
    console.log("submitted");
    generate_new(dimensions)
    return false
}

function show_solution(button) {
    if (button.value === "0") {
        //--show-solution: none;
        r.style.setProperty('--show-solution', 'grid');
        button.value = "1";
    } else {
        r.style.setProperty('--show-solution', 'none');
        button.value = "0";
    }
}

generate_new(2);
