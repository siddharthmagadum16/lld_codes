

const arr = new Array();
const scores = [10, 20, 30];

const func = async () => {

    scores.forEach(score => {
        arr.push(score * 10);
    });
}
(async () => {
    await func();
    console.log(arr);
})();

export { };
