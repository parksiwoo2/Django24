from models import Book, Sector


def get_books_for_sector(sector: Sector):
    qs = Book.objects.all()

    # 페이지 적은 순
    if sector.type == "PAGE_ASC":
        return qs.order_by("pages")

    if sector.type == "PAGE_DESC":
        return qs.order_by("-pages")

    if sector.type == "DIFFICULTY_ASC":
        return qs.order_by("difficulty")

    if sector.type == "DIFFICULTY_DESC":
        return qs.order_by("-difficulty")

    if sector.type == "RATING_DESC":
        return qs.order_by("-rating")

    if sector.type == "MBTI_MATCH":
        mbti = sector.rule.get("mbti")
        if mbti:
            return qs.filter(mbti_tags__contains=[mbti])
        return qs.none()

    return qs.none()


def create_defualt_sectors():
    """
    서비스에 필요한 기본 섹터를 생성함
    manage.py shell에서 한 번만 실행하면 됨
    """

    sectors = [
        ("짧게 읽기 좋은 책", "PAGE_ASC", None),
        ("벽돌책 도전", "PAGE_DESC", None),
        ("독서 입문자용", "DIFFICULTY_ASC", None),
        ("어려운 책부터", "DIFFICULTY_DESC", None),
        ("평점 높은 책", "RATING_DESC", None),
        ("INTJ에게 어울리는 책", "MBTI_MATCH", {"mbti": "INTJ"}),
    ]

    for name, type_, rule in sectors:
        Sector.objects.get_or_create(name=name, type=type_, defaults={"rule": rule})
