import sum from "../components/sum";
// import "@testing-library/jest-dom";
//index.test.js
test('test adding two positive nums', function() {
    expect(sum(4, 5)).toBe(9);
});
