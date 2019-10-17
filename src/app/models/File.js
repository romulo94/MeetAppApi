import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.S3_URL}/${this.path}`;
          },
        },
      },
      {
        sequelize,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    );
    return this;
  }
}

export default File;
