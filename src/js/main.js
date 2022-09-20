const DECIMAL_PLACES = 2;
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
        return "<div class='skalar-operator'></div>";
    }
}

class Cross extends ExerciseElement{
    constructor() {
        super();
    }

    get_html() {
        return "<div class='cross-operator'></div>";
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
    constructor(dimension, decimal_place) {
        this.dimension = dimension
        this.decimal_place = decimal_place
        this.elements = [];
        this.vectors = [];
    }

    round(number) {
        const factor_of_ten = Math.pow(10, this.decimal_place);
        return Math.round(number * factor_of_ten) / factor_of_ten
    }

    get_random_value() {
        let min = 1;
        let max = 10;
        let rand = Math.random() * (max - min) + min
        return this.round(rand)
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
    constructor(dimension, decimal_place) {
        super(dimension, decimal_place);
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
        }

        total_sum = this.round(total_sum);
        return new SkalarResuls(total_sum);
    }
}

class Crossproduct extends Exercise{
    constructor(dimension, decimal_place) {
        super(dimension, decimal_place);
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
            this.round(vec_1[1] * vec_2[2] - vec_1[2] * vec_2[1]),
            this.round(vec_1[2] * vec_2[0] - vec_1[0] * vec_2[2]),
            this.round(vec_1[0] * vec_2[1] - vec_1[1] * vec_2[0])
        ];

        return new Vector(result, true);
    }
}

function generate_skalarprodukt(exercise_element, dimensions, decimal_places) {
    let skalarprodukt = new Scalarprodukt(dimensions, decimal_places);
    exercise_element.innerHTML = skalarprodukt.get_inner_html();
}

function generate_crossprodukt(exercise_element, decimal_places) {
    let crossprodukt = new Crossproduct(3, decimal_places);
    exercise_element.innerHTML = crossprodukt.get_inner_html();
}

function generate_new(dimensions) {
    for (let exercise_element of document.getElementsByClassName("exercise")) {
        let decimal_places = 0;
        if (exercise_element.classList.contains("float")) {decimal_places = DECIMAL_PLACES;}

        if (exercise_element.classList.contains("skalarproduct")) {
            generate_skalarprodukt(exercise_element, dimensions, decimal_places);
            continue;
        }
        if (exercise_element.classList.contains("crossproduct")) {
            generate_crossprodukt(exercise_element, decimal_places);
            continue;
        }
    }

    /*
    let skalarprodukt_container = document.getElementById("skalar-container");
    if (skalarprodukt_container != null) {
        let skalarprodukt = new Scalarprodukt(dimensions);
        skalarprodukt_container.innerHTML = skalarprodukt.get_inner_html();
        console.log(skalarprodukt.get_inner_html());
    }

    let crossprodukt_container = document.getElementById("cross-container");
    if (crossprodukt_container != null) {
        let crossprodukt = new Crossproduct(3);
        crossprodukt_container.innerHTML = crossprodukt.get_inner_html();
        console.log(crossprodukt.get_inner_html());
    }*/
}


function on_submit(form_element) {
    const dimensions = parseInt(document.getElementById("dimensions").value);
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
