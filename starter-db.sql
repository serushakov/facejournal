-- -------------------------------------------------------------
-- TablePlus 3.12.0(354)
--
-- https://tableplus.com/
--
-- Database: db
-- Generation Time: 2020-12-12 11:01:38.5820
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

INSERT INTO `Permissions` (`name`, `createdAt`, `updatedAt`) VALUES
('post.delete', '2020-12-09 08:44:33', '2020-12-09 08:44:33'),
('post.update', '2020-12-09 08:44:33', '2020-12-09 08:44:33'),
('user.delete', '2020-12-09 08:44:33', '2020-12-09 08:44:33');

INSERT INTO `RolePermission` (`createdAt`, `updatedAt`, `RoleName`, `PermissionName`) VALUES
('2020-12-09 08:52:10', '2020-12-09 08:52:10', 'admin', 'post.delete'),
('2020-12-09 08:51:24', '2020-12-09 08:51:24', 'admin', 'user.delete'),
('2020-12-09 08:52:10', '2020-12-09 08:52:10', 'moderator', 'post.delete');

INSERT INTO `Roles` (`name`, `createdAt`, `updatedAt`) VALUES
('admin', '2020-12-09 08:51:03', '2020-12-09 08:51:03'),
('moderator', '2020-12-09 08:47:55', '2020-12-09 08:47:55'),
('user', '2020-12-09 08:27:06', '2020-12-09 08:27:06');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;