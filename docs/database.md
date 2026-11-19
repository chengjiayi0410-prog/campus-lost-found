# 数据库设计草稿

> 阶段：第 2 周前端原型
> 目标：先确定实体和关系，第 3 周接入 Express + MySQL 时再落地为迁移脚本。

## 实体关系

```text
users 1 ─── N posts
categories 1 ─── N posts
posts 1 ─── N images
```

- 一个用户可以发布多条信息。
- 一条信息属于一个分类。
- 一条信息可以有多张图片；MVP 先限制为一张。

## users

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | BIGINT UNSIGNED PK AUTO_INCREMENT | 用户 ID |
| username | VARCHAR(50) UNIQUE NOT NULL | 登录名 |
| password_hash | VARCHAR(255) NOT NULL | bcrypt 哈希，不存明文 |
| role | ENUM('user','admin') DEFAULT 'user' | 角色 |
| avatar_url | VARCHAR(255) NULL | 头像地址 |
| created_at | DATETIME NOT NULL | 创建时间 |
| updated_at | DATETIME NOT NULL | 更新时间 |

## categories

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | INT UNSIGNED PK AUTO_INCREMENT | 分类 ID |
| name | VARCHAR(50) NOT NULL | 显示名称 |
| slug | VARCHAR(50) UNIQUE NOT NULL | 稳定标识，如 `card` |
| created_at | DATETIME NOT NULL | 创建时间 |

初始分类：

```text
card         证件
electronics  电子设备
book         书籍
key          钥匙
other        其他
```

## posts

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | BIGINT UNSIGNED PK AUTO_INCREMENT | 信息 ID |
| user_id | BIGINT UNSIGNED NOT NULL FK -> users.id | 发布者 |
| category_id | INT UNSIGNED NOT NULL FK -> categories.id | 分类 |
| type | ENUM('lost','found') NOT NULL | 失物 / 招领 |
| title | VARCHAR(120) NOT NULL | 标题 |
| description | TEXT NOT NULL | 详细描述 |
| location | VARCHAR(120) NOT NULL | 地点 |
| status | ENUM('open','resolved','hidden') DEFAULT 'open' | 状态 |
| occurred_at | DATETIME NULL | 丢失或捡到时间 |
| created_at | DATETIME NOT NULL | 发布时间 |
| updated_at | DATETIME NOT NULL | 更新时间 |

## images

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | BIGINT UNSIGNED PK AUTO_INCREMENT | 图片 ID |
| post_id | BIGINT UNSIGNED NOT NULL FK -> posts.id | 所属信息 |
| url | VARCHAR(255) NOT NULL | 图片地址 |
| sort_order | TINYINT UNSIGNED DEFAULT 0 | 排序 |
| created_at | DATETIME NOT NULL | 创建时间 |

## 索引

建议先建立以下索引：

```sql
CREATE INDEX idx_posts_type_status ON posts(type, status);
CREATE INDEX idx_posts_category_status ON posts(category_id, status);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_images_post_id ON images(post_id);
```

关键词搜索在 MVP 阶段可以先用 `LIKE`：

```sql
WHERE title LIKE ? OR description LIKE ? OR location LIKE ?
```

数据量增长后再考虑 MySQL FULLTEXT 或独立搜索引擎。

## 约束与约定

- 密码只存 bcrypt 哈希。
- 删除信息优先使用 `status = 'hidden'` 软删除。
- 普通用户只能修改或删除自己的信息。
- 管理员可以隐藏任意违规信息。
- 时间统一存 UTC，展示时转换为本地时区。
- 图片限制类型和大小，文件不直接存进数据库。
