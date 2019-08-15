import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model{
  static init(sequelize){
    super.init(
      // atributos que serão aceitos no request.
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // quando não que presistir o dado no banco
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    // executar comandos antes ou depois de criar/atualizar/
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
export default User;
