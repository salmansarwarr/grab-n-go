import MenuList from "./MenuList";

const Menu = () => {
    return (
        <>
            <MenuList dishes={dishes} />
        </>
    );
};

const dishes = [
    {
        id: 1,
        title: "Smoked Chicken",
        image: "/img/menu/menu-image1.png",
    },
    {
        id: 2,
        title: "Alfredo",
        image: "/img/menu/menu-image2.png",
    },
    {
        id: 3,
        title: "Fried Rice",
        image: "/img/menu/menu-image3.png",
    },
    {
        id: 4,
        title: "Jollof Spaghetti",
        image: "/img/menu/menu-image3.png",
    },
    {
        id: 5,
        title: "Chicken Fried Rice",
        image: "/img/menu/menu-image5.png",
    },
    {
        id: 6,
        title: "Baked sweet potato",
        image: "/img/menu/menu-image6.png",
    },
];

export default Menu
