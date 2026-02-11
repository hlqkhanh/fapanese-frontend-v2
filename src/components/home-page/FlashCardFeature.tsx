import Flashcards from "./FlashCard"

const FlashCardFeature = () => {

    const flashcardData = [
        { title: "Bảng chữ cái", description: "Học Hiragana và Katakana cơ bản." },
        { title: "Ngữ pháp", description: "Tìm hiểu các quy tắc ngữ pháp cơ bản." },
        { title: "Từ vựng", description: "Mở rộng vốn từ qua các chủ đề hằng ngày.", },
        { title: "Speaking", description: "Luyện tập phản xạ và phát âm tự nhiên.", },
    ];
    return (
        <div>
            <section className="py-16 bg-gray-100">
                {" "}
                <div className="max-w-6xl mx-auto px-6">
                    {" "}
                    <h2 className="text-3xl font-bold text-center mb-8">
                        GIỚI THIỆU CHỨC NĂNG FLASHCARDS
                        {" "}
                        <span className="text-primary font-extrabold">
                            GIÚP BẠN HỌC TẬP HIỆU QUẢ
                            {" "}
                        </span>
                        {" "}
                    </h2>
                    <Flashcards cards={flashcardData} />
                    {" "}
                </div>
                {" "}
            </section>
        </div>
    )
}

export default FlashCardFeature