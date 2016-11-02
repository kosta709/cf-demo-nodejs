#!/usr/bin/python
#

import sys, json, pprint, boto

def update_ecs_task(describe_task_json, outfile):

    updated_task = describe_task_json['taskDefinition']
    revision = updated_task["revision"]
    keys_to_remove = ["status", "taskDefinitionArn", "requiresAttributes", "revision"]
    for k in keys_to_remove:
        updated_task.pop(k, None)

    pprint.pprint(updated_task)

if __name__ == '__main__':
    infile = sys.argv[1]
    outfile = sys.argv[2]

    with open(infile) as task_in:
        update_ecs_task(json.load(task_in), outfile)





