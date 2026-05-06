from app.crud.user import (
    get_user_by_email,
    get_user_by_username,
    get_user_by_id,
    create_user,
    authenticate_user,
    update_user,
    deactivate_user
)

from app.crud.discussions import (
    create_discussion,
    get_all_discussions,
    get_discussion,
    update_discussion,
    delete_discussion,
    get_user_discussions,
    search_discussions
)

from app.crud.blogs import (
    create_blog,
    get_all_blogs,
    get_blog,
    update_blog,
    delete_blog,
    get_user_blogs,
    search_blogs,
    publish_blog,
    unpublish_blog
)

from app.crud.comments import(
    create_comment,
    get_comment,
    get_discussion_comments,
    update_comment,
    delete_comment,
)

# Export everything so it can be imported as crud.create_blog
__all__ = [
    "get_user_by_email",
    "get_user_by_username",
    "get_user_by_id",
    "create_user",
    "authenticate_user",
    "update_user",
    "deactivate_user",
    "create_discussion",
    "get_all_discussions",
    "get_discussion",
    "update_discussion",
    "delete_discussion",
    "get_user_discussions",
    "search_discussions",
    "create_blog",
    "get_all_blogs",
    "get_blog",
    "update_blog",
    "delete_blog",
    "get_user_blogs",
    "search_blogs",
    "publish_blog",
    "unpublish_blog",
    "create_comment",
    "get_comment",
    "get_discussion_comments",
    "update_comment",
    "delete_comment",
]