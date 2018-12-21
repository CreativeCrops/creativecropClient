main()
{
CDIR=${HOME}
RAND_DIR=$1
DAY=`date +%b_%d_%Y`
WORK_DIR=${CDIR}/WH_DIR/${DAY}/CRM_COMPONENTS_PARALLEL/${RAND_DIR}

OUTPUT_DIR=${WORK_DIR}/mac_app/output
export nodepath=/Users/ios_build/lyte_node/.nvm/versions/node/v9.0.0/
export PATH=${nodepath}/bin:${PATH}

CREATE_DIST

}
CREATE_DIST()
{
cd ${WORK_DIR}
unzip -d CRM_COMPONENTS_DBUILD crm_components_lyte.zip
mkdir -p ${WORK_DIR}/mac_app/output
cd CRM_COMPONENTS_DBUILD/
node -v
npm -v
pwd
ls
lyte loc
lyte build --production


cp -r ${WORK_DIR}/CRM_COMPONENTS_DBUILD//dist ${OUTPUT_DIR}/
cd ${OUTPUT_DIR}
zip -r crm_components_op.zip .
}
main $*

