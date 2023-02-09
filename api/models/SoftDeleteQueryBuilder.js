/*
* reference: https://github.com/Vincit/objection.js/issues/88#issuecomment-188860565
* */
const { Model } = require('objection')
const moment = require('moment')

class SoftDeleteQueryBuilder extends Model.QueryBuilder {
  // eslint-disable-next-line no-useless-constructor
  constructor (modelClass) {
    super(modelClass)

    // this.onBuild(builder => {
    //     if (!builder.context().withArchived) {
    //         builder.whereNull('deleted_at');
    //     }
    // });
  }

  // withArchived(withArchived) {
  //     this.context().withArchived = withArchived;
  //     return this;
  // }

  /*
    * must use where/findById
    * model.query().findById().softDelete()
    * */
  softDelete () {
    return this.patch({
      deleted_at: moment().format('YYYY-MM-DD HH:mm:ss').toString()
    })
  }

  /*
    * cannot use upsert because it will hard-delete the related_model data
    * model.query().softDeleteId(primary_key)
    *
    * options{
    *   deleteWithRelated : [boolean] //false as default
    * }
    * */
  async softDeleteById (id, options = null) {
    if (options == null) {
      options = {
        deleteWithRelated: true,
        hardDelete: false
      }
    }

    let relations = this.modelClass().relationMappings
    if (options.deleteWithRelated === true && relations) {
      let model = await this.modelClass().query().findById(id)

      // softdelete all relations of this model
      // eslint-disable-next-line camelcase
      for (const relation_class_name of Object.keys(relations)) {
        if (relations[relation_class_name].softDelete) {
          await model.$relatedQuery(relation_class_name).softDelete()
        }
      }
    }

    // softdelete model
    return this.where('uuid', id).patch({
      deleted_at: moment().format('YYYY-MM-DD HH:mm:ss').toString()
    })
  }

  deleteById (id) {
    return this.softDeleteById(id)
  }

  delete () {
    return this.softDelete()
  }
}

Model.QueryBuilder = SoftDeleteQueryBuilder
Model.RelatedQueryBuilder = SoftDeleteQueryBuilder
