

const MainView = () => {
    const btn = () => {
        window.api.send("Main.test", {test: "heelo"});
        console.log("Main.test");
    };
    return <button onClick={btn}>CLICK</button>
};

export default MainView;
