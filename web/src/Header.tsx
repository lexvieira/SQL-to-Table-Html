import React from "react";

interface HeaderPropost {
    title?: string;
}

//Transform a function in a arrow function
const Header: React.FC<HeaderPropost> = (props) => {

    return (
        <header>
            <h1>{props.title}</h1>
        </header>
    );
}

export default Header;