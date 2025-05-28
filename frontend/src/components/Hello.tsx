import React from 'react';

const Hello = ({name = "Hello World"}) => {
    const greeting = `Hello ${name}`;
    return <h1>{greeting}</h1>;
}
export default Hello;

// const Hello = (props:any) => {
//     const greeting = `Hello ${props.name ?? 'Hello World'}`;
//     return <h1>{greeting}</h1>;
// }
// export default Hello;