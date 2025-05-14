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
        title: "Smoked Jerk Chicken",
        image: "/img/menu/menu-image1.png",
        description: "Jerk chicken w/ jerk gravy, mashed potatoes, sautéed kale",
        ingredients: ["Jerk chicken", "Jerk gravy", "Mashed potatoes", "Sautéed kale"],
    },
    {
        id: 2,
        title: "Alfredo",
        image: "/img/menu/menu-image2.png",
        description: "Your Classic Chicken Alfredo w/ sautéed broccoli.",
        ingredients: ["Musroom", "Cherry tomatoes", "Spinach"],
    },
    {
        id: 3,
        title: "Fried Rice",
        image: "/img/menu/menu-image3.png",
        description: "Fried rice w/ seasoned chicken & vegetables.",
        ingredients: ["Fried rice", "Chicken", "Vegetables"],
    },
    {
        id: 4,
        title: "Jollof Spaghetti",
        image: "/img/menu/menu-image-joll.jpeg",
        description: "Jollof style Meaty (ground beef and beef sausage) based sauce w/ spaghetti pasta and fresh spinach.",
        ingredients: ["Ground beef", "Beef sausage", "Spaghetti pasta", "Fresh spinach"],
    },
    {
        id: 5,
        title: "Chicken Fried Rice",
        image: "/img/menu/menu-image5.png",
        description: "Mixed veggies w/shredded chicken, basmati rice full of flavor. With roasted 4-5oz salmon.",
        ingredients: ["Mixed veggies", "Chicken", "Basmati Rice", "Salmon"],
    },
    {
        id: 6,
        title: "Baked sweet potato",
        image: "/img/menu/menu-image6.png",
        description: "Seasoned baked sweet potatoes w/salmon & sweet peppers.",
        ingredients: ["Sweet potatoes", "Salmon", "Sweet peppers"],
    },
];

export default Menu
